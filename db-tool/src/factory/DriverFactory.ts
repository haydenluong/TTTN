import { DbConfig } from '../config/config.schema';
import { MySQLDriver } from '../drivers/mysql/MySQLDriver';
import { MariaDBDriver } from '../drivers/mariadb/MariaDBDriver';
import { MSSQLDriver } from '../drivers/mssql/MSSQLDriver';
import { MongoDBDriver } from '../drivers/mongodb/MongoDBDriver';
import { DatabaseDriver } from '../interfaces/DatabaseDriver';

export function createDriver(config: DbConfig): DatabaseDriver {
    switch (config.dialect) {
        case 'mysql':
            return new MySQLDriver(config);
        case 'mariadb':
            return new MariaDBDriver(config);
        case 'mssql':
            return new MSSQLDriver(config);
        case 'mongodb':
            return new MongoDBDriver(config);
        default:
            throw new Error(`Unsupported dialect: ${config.dialect}`);
    }
}