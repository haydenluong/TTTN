// zod validator for db.config.json, as typescript type cannot validate runtime data. This is the source of truth for config shape.

import { z } from 'zod';

export const DbConfigSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    database: z.string().min(1),
    host: z.string().min(1),
    dialect: z.enum(['mysql', 'mariadb', 'mssql', 'mongodb']),
    port: z.number().int().positive(),
});

// creates a TypeScript type from the zod schema named DbConfig. This is the type that the rest of the app imports and uses.
export type DbConfig = z.infer<typeof DbConfigSchema>;
