import { DatabaseDriver } from '../../interfaces/DatabaseDriver';
import { DbConfig } from '../../types/config.types';
import mariadb, { Connection } from 'mariadb';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { checksumOf, readMetadata, writeMetadata } from '../../utils/metadata';
import { topologicalSortTables } from '../../utils/topoSort';
import { withRetry, DEFAULT_TIMEOUT_MS } from '../../utils/retry';
import { readProgress, markTableDone, clearProgress } from '../../utils/progress';

const execAsync = promisify(exec);

// MariaDB is wire-compatible with MySQL: same SQL dialect, same information_schema
// catalog, and the same mysqldump/mysql CLI tools work against it. This driver
// mirrors MySQLDriver almost exactly, swapping the mysql2 client for the mariadb client.
export class MariaDBDriver implements DatabaseDriver {
  private config: DbConfig;
  private connection: Connection | null = null;
  private lastSnapshotPath: string | null = null;

  constructor(config: DbConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.connection = await mariadb.createConnection({
      host: this.config.host,
      user: this.config.username,
      password: this.config.password,
      database: this.config.database,
      port: this.config.port,
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
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

    if (!this.connection) {
      await this.connect();
    }

    const tables = await this.getTables();
    const foreignKeys = await this.getForeignKeys();

    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    // snapshot of each table's row count at backup time, so verify() can later
    // detect if a restore ended up with more/fewer rows than were actually backed up.
    const rowCounts: Record<string, number> = {};
    for (const table of tables) {
      const rows = await this.connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
      rowCounts[table] = Number((rows as { count: number | bigint }[])[0].count);
    }

    const dumpFile = path.join(fullDir, 'full.sql');

    const command = `mysqldump --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} > "${dumpFile}"`;

    await execAsync(command, {
      env: { ...process.env, MYSQL_PWD: this.config.password },
    });

    // one extra dump per table, same command shape as the full dump above,
    // just with the table name appended so mysqldump only exports that table.
    for (const table of tables) {
      const tableFile = path.join(dbDir, `${table}.sql`);
      const tableCommand = `mysqldump --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} ${table} > "${tableFile}"`;

      await execAsync(tableCommand, {
        env: { ...process.env, MYSQL_PWD: this.config.password },
      });
    }

    await writeMetadata(
      targetDir,
      'mariadb',
      this.config.database,
      tables,
      foreignKeys,
      rowCounts,
      dumpFile,
    );

    await this.disconnect();
  }

  async restore(sourceDir: string): Promise<void> {
    const metadata = await readMetadata(sourceDir);
    const order = topologicalSortTables(metadata.tables, metadata.foreignKeys);
    const done = await readProgress(sourceDir);

    for (const table of order) {
      if (done.includes(table)) {
        continue;
      }

      const tableFile = path.join(sourceDir, 'DB', `${table}.sql`);
      const command = `mysql --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} < "${tableFile}"`;

      await withRetry(() =>
        execAsync(command, {
          env: { ...process.env, MYSQL_PWD: this.config.password },
          timeout: DEFAULT_TIMEOUT_MS,
        }),
      );

      await markTableDone(sourceDir, table);
    }

    await clearProgress(sourceDir);
  }

  async createSnapshot(targetDir: string): Promise<void> {
    await fs.ensureDir(targetDir);

    const timestamp = Date.now();
    const snapshotFile = path.join(targetDir, `snapshot-${timestamp}.sql`);

    const command = `mysqldump --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} > "${snapshotFile}"`;

    await execAsync(command, {
      env: { ...process.env, MYSQL_PWD: this.config.password },
    });

    this.lastSnapshotPath = snapshotFile;
  }

  async rollback(): Promise<void> {
    if (!this.lastSnapshotPath) {
      throw new Error('No snapshot available to rollback to');
    }

    const command = `mysql --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} < "${this.lastSnapshotPath}"`;

    await execAsync(command, {
      env: { ...process.env, MYSQL_PWD: this.config.password },
    });
  }

  async verify(sourceDir: string): Promise<boolean> {
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    try {
      const metadata = await readMetadata(sourceDir);

      const tables = await this.getTables();
      const foreignKeys = await this.getForeignKeys();

      const sameTables =
        JSON.stringify([...tables].sort()) === JSON.stringify([...metadata.tables].sort());
      if (!sameTables) {
        return false;
      }

      const sameForeignKeys =
        JSON.stringify([...foreignKeys].sort()) ===
        JSON.stringify([...metadata.foreignKeys].sort());
      if (!sameForeignKeys) {
        return false;
      }

      for (const table of tables) {
        const rows = await this.connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        const liveCount = Number((rows as { count: number | bigint }[])[0].count);

        if (liveCount !== metadata.rowCounts[table]) {
          return false;
        }
      }

      const dumpFile = path.join(sourceDir, 'full', 'full.sql');
      const liveChecksum = await checksumOf(dumpFile);
      if (liveChecksum !== metadata.checksum) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async getTables(): Promise<string[]> {
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    const rows = await this.connection.query(
      'SELECT table_name AS table_name FROM information_schema.tables WHERE table_schema = ?',
      [this.config.database],
    );

    return (rows as { table_name: string }[]).map((row) => row.table_name);
  }

  async getForeignKeys(): Promise<string[]> {
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    const rows = await this.connection.query(
      `SELECT table_name AS table_name, column_name AS column_name, referenced_table_name AS referenced_table_name, referenced_column_name AS referenced_column_name
             FROM information_schema.key_column_usage
             WHERE table_schema = ? AND referenced_table_name IS NOT NULL`,
      [this.config.database],
    );

    return (
      rows as {
        table_name: string;
        column_name: string;
        referenced_table_name: string;
        referenced_column_name: string;
      }[]
    ).map(
      (row) =>
        `${row.table_name}.${row.column_name} -> ${row.referenced_table_name}.${row.referenced_column_name}`,
    );
  }

  async getSchema(): Promise<string> {
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    const rows = await this.connection.query(
      `SELECT table_name AS table_name, column_name AS column_name, data_type AS data_type, is_nullable AS is_nullable
             FROM information_schema.columns
             WHERE table_schema = ?
             ORDER BY table_name, ordinal_position`,
      [this.config.database],
    );

    const schema: Record<
      string,
      { column_name: string; data_type: string; is_nullable: string }[]
    > = {};

    for (const row of rows as {
      table_name: string;
      column_name: string;
      data_type: string;
      is_nullable: string;
    }[]) {
      if (!schema[row.table_name]) {
        schema[row.table_name] = [];
      }
      schema[row.table_name].push({
        column_name: row.column_name,
        data_type: row.data_type,
        is_nullable: row.is_nullable,
      });
    }

    return JSON.stringify(schema);
  }
}
