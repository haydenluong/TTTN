import { DatabaseDriver } from '../../interfaces/DatabaseDriver';
import { DbConfig } from '../../types/config.types';
import { MongoClient, Db } from 'mongodb';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { checksumOf, readMetadata, writeMetadata } from '../../utils/metadata';
import { topologicalSortTables } from '../../utils/topoSort';
import { withRetry, DEFAULT_TIMEOUT_MS } from '../../utils/retry';
import { readProgress, markTableDone, clearProgress } from '../../utils/progress';

const execAsync = promisify(exec);

export class MongoDBDriver implements DatabaseDriver {
  private config: DbConfig;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private lastSnapshotPath: string | null = null;

  constructor(config: DbConfig) {
    this.config = config;
  }

  private buildUri(): string {
    // Mongo auth + host/port are encoded into one connection string, unlike mysql2's separate fields.
    return `mongodb://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
  }

  async connect(): Promise<void> {
    this.client = new MongoClient(this.buildUri());
    await this.client.connect();
    this.db = this.client.db(this.config.database);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  async test(): Promise<boolean> {
    try {
      await this.connect();
      await this.disconnect();
      return true;
    } catch (error) {
      return false;
    }
  }

  async backup(targetDir: string): Promise<void> {
    const fullDir = path.join(targetDir, 'full');
    const dbDir = path.join(targetDir, 'DB');
    await fs.ensureDir(fullDir);
    await fs.ensureDir(dbDir);

    if (!this.db) {
      await this.connect();
    }

    const tables = await this.getTables();
    const foreignKeys = await this.getForeignKeys();

    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    // snapshot of each collection's document count at backup time, so verify() can
    // later detect if a restore ended up with more/fewer documents than were backed up.
    const rowCounts: Record<string, number> = {};
    for (const table of tables) {
      rowCounts[table] = await this.db.collection(table).estimatedDocumentCount();
    }

    const archiveFile = path.join(fullDir, 'full.archive');

    // mongodump's --uri flag accepts the same connection string we use to connect.
    const command = `mongodump --uri="${this.buildUri()}" --archive="${archiveFile}"`;

    await execAsync(command);

    // one extra dump per collection — mongodump's --collection flag scopes
    // the dump to a single collection within --db, instead of the whole database.
    for (const table of tables) {
      const tableFile = path.join(dbDir, `${table}.archive`);
      const tableCommand = `mongodump --uri="${this.buildUri()}" --db="${this.config.database}" --collection="${table}" --archive="${tableFile}"`;

      await execAsync(tableCommand);
    }

    await writeMetadata(
      targetDir,
      'mongodb',
      this.config.database,
      tables,
      foreignKeys,
      rowCounts,
      archiveFile,
    );

    await this.disconnect();
  }

  async restore(sourceDir: string): Promise<void> {
    const metadata = await readMetadata(sourceDir);
    // mongo has no FKs so this is a no-op ordering, kept for consistency
    const order = topologicalSortTables(metadata.tables, metadata.foreignKeys);
    const done = await readProgress(sourceDir);

    for (const table of order) {
      if (done.includes(table)) {
        continue;
      }

      const tableFile = path.join(sourceDir, 'DB', `${table}.archive`);
      const command = `mongorestore --uri="${this.buildUri()}" --archive="${tableFile}" --drop`;

      await withRetry(() => execAsync(command, { timeout: DEFAULT_TIMEOUT_MS }));

      await markTableDone(sourceDir, table);
    }

    await clearProgress(sourceDir);
  }

  async createSnapshot(targetDir: string): Promise<void> {
    await fs.ensureDir(targetDir);

    const timestamp = Date.now();
    const snapshotFile = path.join(targetDir, `snapshot-${timestamp}.archive`);

    const command = `mongodump --uri="${this.buildUri()}" --archive="${snapshotFile}"`;

    await execAsync(command);

    this.lastSnapshotPath = snapshotFile;
  }

  async rollback(): Promise<void> {
    if (!this.lastSnapshotPath) {
      throw new Error('No snapshot available to rollback to');
    }

    const command = `mongorestore --uri="${this.buildUri()}" --archive="${this.lastSnapshotPath}" --drop`;

    await execAsync(command);
  }

  async verify(sourceDir: string): Promise<boolean> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    try {
      const metadata = await readMetadata(sourceDir);

      const collections = await this.getTables();
      const foreignKeys = await this.getForeignKeys();

      const sameTables =
        JSON.stringify([...collections].sort()) === JSON.stringify([...metadata.tables].sort());
      if (!sameTables) {
        return false;
      }

      const sameForeignKeys =
        JSON.stringify([...foreignKeys].sort()) ===
        JSON.stringify([...metadata.foreignKeys].sort());
      if (!sameForeignKeys) {
        return false;
      }

      for (const name of collections) {
        // estimatedDocumentCount() forces Mongo to actually read the collection, similar to SELECT COUNT(*) for SQL.
        const liveCount = await this.db.collection(name).estimatedDocumentCount();

        if (liveCount !== metadata.rowCounts[name]) {
          return false;
        }
      }

      const archiveFile = path.join(sourceDir, 'full', 'full.archive');
      const liveChecksum = await checksumOf(archiveFile);
      if (liveChecksum !== metadata.checksum) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async getTables(): Promise<string[]> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    const collections = await this.db.listCollections().toArray();
    return collections.map((c) => c.name);
  }

  async getForeignKeys(): Promise<string[]> {
    // MongoDB has no enforced foreign key constraints (it's schemaless),
    // so there is nothing equivalent to information_schema.key_column_usage to query.
    return [];
  }

  async getSchema(): Promise<string> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    const collections = await this.getTables();
    const schema: Record<string, string[]> = {};

    for (const name of collections) {
      // Sample one document per collection and use its field names as a best-effort schema,
      // since Mongo collections don't have a fixed column list like SQL tables do.
      const sample = await this.db.collection(name).findOne();
      schema[name] = sample ? Object.keys(sample) : [];
    }

    return JSON.stringify(schema);
  }
}
