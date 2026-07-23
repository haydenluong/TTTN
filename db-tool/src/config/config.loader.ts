import path from 'path';
import fs from 'fs-extra';
import { DbConfigSchema, DbConfig } from './config.schema';

// Reads config/db.config.json, validates with zod, and returns a typed object.
// If invalid → prints "Invalid Config" and exits. Clean exit, no crash/stacktrace.
export function loadConfig(): DbConfig {
  const configPath = path.resolve(process.cwd(), 'config', 'db.config.json');

  if (!fs.existsSync(configPath)) {
    console.error('Invalid Config: config/db.config.json not found');
    process.exit(1);
  }

  const raw: unknown = fs.readJsonSync(configPath);
  const result = DbConfigSchema.safeParse(raw); // safeParse = won't throw, returns {success, data, error}

  if (!result.success) {
    console.error('Invalid Config:');
    result.error.errors.forEach((e) => {
      console.error(`  ${e.path.join('.')} — ${e.message}`);
    });
    process.exit(1);
  }

  return result.data;
}
