// this file writes the description of a backup to a metadata.json file:
// which database/dialect it came from, when it was made, which tables and foreign keys existed at backup time, and a fingerprint (checksum) of the dump file's bytes.

import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';


export interface BackupMetadata {
    version: string;
    dialect: string;
    database: string;
    createdAt: string;
    tables: string[];
    foreignKeys: string[];
    rowCounts: Record<string, number>;
    checksum: string;
}

// checksum is a sha256 of the dump file's bytes, so verify() can later detect
// if the dump on disk was altered/corrupted after the backup ran.
export async function checksumOf(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// writes metadata.json at the root of a backup directory (alongside full/, DB/, logs/).
export async function writeMetadata(
    targetDir: string,
    dialect: string,
    database: string,
    tables: string[],
    foreignKeys: string[],
    rowCounts: Record<string, number>,
    dumpFile: string
): Promise<void> {
    const metadata: BackupMetadata = {
        version: '1.0',
        dialect,
        database,
        createdAt: new Date().toISOString(),
        tables,
        foreignKeys,
        rowCounts,
        checksum: await checksumOf(dumpFile),
    };

    await fs.writeJson(path.join(targetDir, 'metadata.json'), metadata, { spaces: 2 });
}

// reads metadata.json back from a backup directory, e.g. for verify() to compare against.
export async function readMetadata(targetDir: string): Promise<BackupMetadata> {
    return fs.readJson(path.join(targetDir, 'metadata.json')) as Promise<BackupMetadata>;
}