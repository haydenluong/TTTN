import { DatabaseDriver } from '../../interfaces/DatabaseDriver';
import { DbConfig } from '../../types/config.types';
import mariadb, { Connection } from 'mariadb';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';

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
        await fs.ensureDir(fullDir);

        const dumpFile = path.join(fullDir, 'full.sql');

        const command = `mysqldump --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} > "${dumpFile}"`;

        await execAsync(command, {
            env: { ...process.env, MYSQL_PWD: this.config.password },
        });
    }

    async restore(sourceDir: string): Promise<void> {
        const dumpFile = path.join(sourceDir, 'full', 'full.sql');

        const command = `mysql --host=${this.config.host} --port=${this.config.port} --user=${this.config.username} ${this.config.database} < "${dumpFile}"`;

        await execAsync(command, {
            env: { ...process.env, MYSQL_PWD: this.config.password },
        });
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

    async verify(): Promise<boolean> {
        if (!this.connection) {
            throw new Error('Not connected to the database');
        }

        try {
            const tables = await this.getTables();

            for (const table of tables) {
                await this.connection.query(`SELECT COUNT(*) FROM \`${table}\``);
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
            'SELECT table_name FROM information_schema.tables WHERE table_schema = ?',
            [this.config.database]
        );

        return (rows as { table_name: string }[]).map(row => row.table_name);
    }

    async getForeignKeys(): Promise<string[]> {
        if (!this.connection) {
            throw new Error('Not connected to the database');
        }

        const rows = await this.connection.query(
            `SELECT table_name, column_name, referenced_table_name, referenced_column_name
             FROM information_schema.key_column_usage
             WHERE table_schema = ? AND referenced_table_name IS NOT NULL`,
            [this.config.database]
        );

        return (rows as {
            table_name: string;
            column_name: string;
            referenced_table_name: string;
            referenced_column_name: string;
        }[]).map(row => `${row.table_name}.${row.column_name} -> ${row.referenced_table_name}.${row.referenced_column_name}`);
    }

    async getSchema(): Promise<string> {
        if (!this.connection) {
            throw new Error('Not connected to the database');
        }

        const rows = await this.connection.query(
            `SELECT table_name, column_name, data_type, is_nullable
             FROM information_schema.columns
             WHERE table_schema = ?
             ORDER BY table_name, ordinal_position`,
            [this.config.database]
        );

        const schema: Record<string, { column_name: string; data_type: string; is_nullable: string }[]> = {};

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
