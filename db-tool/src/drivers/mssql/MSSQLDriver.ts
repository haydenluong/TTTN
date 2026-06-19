import { DatabaseDriver } from '../../interfaces/DatabaseDriver';
import { DbConfig } from '../../types/config.types';
import sql, { ConnectionPool } from 'mssql';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';

const execAsync = promisify(exec);

export class MSSQLDriver implements DatabaseDriver {
    private config: DbConfig;
    private pool: ConnectionPool | null = null;
    private lastSnapshotPath: string | null = null;

    constructor(config: DbConfig) {
        this.config = config;
    }

    private connectionString(): string {
        return `Server=${this.config.host},${this.config.port};Database=${this.config.database};User Id=${this.config.username};Password=${this.config.password};`;
    }

    async connect(): Promise<void> {
        this.pool = await sql.connect({
            server: this.config.host,
            port: this.config.port,
            user: this.config.username,
            password: this.config.password,
            database: this.config.database,
            options: {
                trustServerCertificate: true,
            },
        });
    }

    async disconnect(): Promise<void> {
        if (this.pool) {
            await this.pool.close();
            this.pool = null;
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

        const bacpacFile = path.join(fullDir, 'full.bacpac');

        // sqlpackage is Microsoft's CLI tool for exporting a full SQL Server database into a .bacpac file.
        const command = `sqlpackage /Action:Export /SourceConnectionString:"${this.connectionString()}" /TargetFile:"${bacpacFile}"`;

        await execAsync(command);
    }

    async restore(sourceDir: string): Promise<void> {
        const bacpacFile = path.join(sourceDir, 'full', 'full.bacpac');

        // /Action:Import recreates the database from the .bacpac, the reverse of Export.
        const command = `sqlpackage /Action:Import /SourceFile:"${bacpacFile}" /TargetConnectionString:"${this.connectionString()}"`;

        await execAsync(command);
    }

    async createSnapshot(targetDir: string): Promise<void> {
        await fs.ensureDir(targetDir);

        const timestamp = Date.now();
        const snapshotFile = path.join(targetDir, `snapshot-${timestamp}.bacpac`);

        const command = `sqlpackage /Action:Export /SourceConnectionString:"${this.connectionString()}" /TargetFile:"${snapshotFile}"`;

        await execAsync(command);

        this.lastSnapshotPath = snapshotFile;
    }

    async rollback(): Promise<void> {
        if (!this.lastSnapshotPath) {
            throw new Error('No snapshot available to rollback to');
        }

        const command = `sqlpackage /Action:Import /SourceFile:"${this.lastSnapshotPath}" /TargetConnectionString:"${this.connectionString()}"`;

        await execAsync(command);
    }

    async verify(): Promise<boolean> {
        if (!this.pool) {
            throw new Error('Not connected to the database');
        }

        try {
            const tables = await this.getTables();

            for (const table of tables) {
                await this.pool.request().query(`SELECT COUNT(*) FROM [${table}]`);
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async getTables(): Promise<string[]> {
        if (!this.pool) {
            throw new Error('Not connected to the database');
        }

        // SQL Server's catalog view for user tables (sys.tables doesn't include schema name,
        // but TABLE_NAME from INFORMATION_SCHEMA matches what we used for MySQL/MariaDB).
        const result = await this.pool.request().query(
            `SELECT TABLE_NAME as table_name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
        );

        return (result.recordset as { table_name: string }[]).map(row => row.table_name);
    }

    async getForeignKeys(): Promise<string[]> {
        if (!this.pool) {
            throw new Error('Not connected to the database');
        }

        const result = await this.pool.request().query(`
            SELECT
                fk.name AS fk_name,
                tp.name AS table_name,
                cp.name AS column_name,
                tr.name AS referenced_table_name,
                cr.name AS referenced_column_name
            FROM sys.foreign_keys fk
            INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
            INNER JOIN sys.tables tp ON tp.object_id = fkc.parent_object_id
            INNER JOIN sys.columns cp ON cp.object_id = tp.object_id AND cp.column_id = fkc.parent_column_id
            INNER JOIN sys.tables tr ON tr.object_id = fkc.referenced_object_id
            INNER JOIN sys.columns cr ON cr.object_id = tr.object_id AND cr.column_id = fkc.referenced_column_id
        `);

        return (result.recordset as {
            table_name: string;
            column_name: string;
            referenced_table_name: string;
            referenced_column_name: string;
        }[]).map(row => `${row.table_name}.${row.column_name} -> ${row.referenced_table_name}.${row.referenced_column_name}`);
    }

    async getSchema(): Promise<string> {
        if (!this.pool) {
            throw new Error('Not connected to the database');
        }

        const result = await this.pool.request().query(
            `SELECT TABLE_NAME as table_name, COLUMN_NAME as column_name, DATA_TYPE as data_type, IS_NULLABLE as is_nullable
             FROM INFORMATION_SCHEMA.COLUMNS
             ORDER BY TABLE_NAME, ORDINAL_POSITION`
        );

        const schema: Record<string, { column_name: string; data_type: string; is_nullable: string }[]> = {};

        for (const row of result.recordset as {
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
