import { DatabaseDriver } from '../../interfaces/DatabaseDriver';
import { DbConfig } from '../../types/config.types';
import mysql from 'mysql2/promise';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';
import { checksumOf, readMetadata, writeMetadata } from '../../utils/metadata';
import { topologicalSortTables } from '../../utils/topoSort';
import { withRetry, DEFAULT_TIMEOUT_MS } from '../../utils/retry';
import { readProgress, markTableDone, clearProgress } from '../../utils/progress';

const execAsync = promisify(exec);

export class MySQLDriver implements DatabaseDriver {
  private config: DbConfig;
  private lastSnapshotPath: string | null = null;
  private connection: mysql.Connection | null = null;
  constructor(config: DbConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
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

  // which directory to be backed up to. This is the target directory for the backup. The backup will be stored in a subdirectory named 'full' inside the target directory.
  async backup(targetDir: string): Promise<void> {
    const fullDir = path.join(targetDir, 'full');
    const dbDir = path.join(targetDir, 'DB');

    // makes sure the backup directory exists, if not, create it.
    await fs.ensureDir(fullDir);
    await fs.ensureDir(dbDir);

    if (!this.connection) {
      await this.connect();
    }

    const tables = await this.getTables();
    const foreignKeys = await this.getForeignKeys();

    // snapshot of each table's row count at backup time, so verify() can later
    // detect if a restore ended up with more/fewer rows than were actually backed up.
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    const rowCounts: Record<string, number> = {};
    for (const table of tables) {
      const [rows] = await this.connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
      rowCounts[table] = (rows as { count: number }[])[0].count;
    }

    // full.sql is what be written to. This is the file that will contain the full database dump.
    const dumpFile = path.join(fullDir, 'full.sql');

    const command = `mysqldump --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} > "${dumpFile}"`;

    // bảo mật mật khẩu qua env variable để tránh lộ mk trong command line
    await execAsync(command, {
      env: { ...process.env, MYSQL_PWD: this.config.password },
    });

    // tạo file sql dump với từng table
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
      'mysql',
      this.config.database,
      tables,
      foreignKeys,
      rowCounts,
      dumpFile,
    );

    await this.disconnect();
  }

  // compares live database with the backup/restore source/target, to check if they match. This is used after backup to verify that the backup was created correctly, and after restore to verify that the restore was successful.
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
        const [rows] = await this.connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
        const liveCount = (rows as { count: number }[])[0].count;

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

  // The database we are restoring to already exists
  // sourceDir is the backup folder we are restoring from
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
    const snapshotFile = path.join(targetDir, `snapshot-${timestamp}`);

    // write everything to snapshotFile
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

  // return cấu trúc của database dưới dạng JSON object.
  // this is used to check if the schema of the database matches the schema of the backup/restore source/target, and to create a JSON schema file for the backup/restore source/target.
  async getSchema(): Promise<string> {
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    const [rows] = await this.connection.query(
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

  // review
  // return the names of all tables in the database. This is used for the CLI menu to show the list of tables to backup/restore.
  // This is also used for the verify function to check if all tables are present in the backup/restore source/target.
  // this is also used for the getSchema function to get the schema of each table in order to create the JSON schema file.
  // This is also used for the createSnapshot function to know which tables to include in the snapshot.
  //
  async getTables(): Promise<string[]> {
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    const [rows] = await this.connection.query(
      'SELECT table_name AS table_name FROM information_schema.tables WHERE table_schema = ?',
      [this.config.database],
    );

    return (rows as { table_name: string }[]).map((row) => row.table_name);
  }

  // returns an array of each individual foreign key relationship
  //     [  'orders.user_id -> users.id',
  //        'orders.product_id -> products.id',
  //         'payments.order_id -> orders.id'
  // ]
  // This is used for the verify function to check if all foreign keys are present in the backup/restore source/target, for createSnapshot to know which foreign keys to include in the snapshot, and for getSchema to include the foreign key relationships in the JSON schema file.

  async getForeignKeys(): Promise<string[]> {
    if (!this.connection) {
      throw new Error('Not connected to the database');
    }

    const [rows] = await this.connection.query(
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
}
