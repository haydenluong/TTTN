import { DatabaseDriver } from '../../interfaces/DatabaseDriver';
import { DbConfig } from '../../types/config.types';
import { MongoClient, Db } from 'mongodb';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs-extra';

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
        await fs.ensureDir(fullDir);

        const archiveFile = path.join(fullDir, 'full.archive');

        // mongodump's --uri flag accepts the same connection string we use to connect.
        const command = `mongodump --uri="${this.buildUri()}" --archive="${archiveFile}"`;

        await execAsync(command);
    }

    async restore(sourceDir: string): Promise<void> {
        const archiveFile = path.join(sourceDir, 'full', 'full.archive');

        // --drop clears existing collections first, mirroring mysql's behavior of recreating tables.
        const command = `mongorestore --uri="${this.buildUri()}" --archive="${archiveFile}" --drop`;

        await execAsync(command);
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

    async verify(): Promise<boolean> {
        if (!this.db) {
            throw new Error('Not connected to the database');
        }

        try {
            const collections = await this.getTables();

            for (const name of collections) {
                // estimatedDocumentCount() forces Mongo to actually read the collection, similar to SELECT COUNT(*) for SQL.
                await this.db.collection(name).estimatedDocumentCount();
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
        return collections.map(c => c.name);
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
