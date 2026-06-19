export interface DatabaseDriver {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    test(): Promise<boolean>;
    backup(targetDir: string): Promise<void>;
    restore(sourceDir: string): Promise<void>;
    verify(): Promise<boolean>;
    rollback(): Promise<void>;
    createSnapshot(targetDir: string): Promise<void>;
    getSchema(): Promise<string>; // returns the database schema as a JSON object
    getForeignKeys(): Promise<string[]>;
    getTables(): Promise<string[]>;
}

