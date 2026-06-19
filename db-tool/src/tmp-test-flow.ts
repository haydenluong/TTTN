import { loadConfig } from './config/config.loader';
import { createDriver } from './factory/DriverFactory';

async function main(): Promise<void> {
    const config = loadConfig();
    const driver = createDriver(config);

    console.log('--- test() ---');
    console.log(await driver.test());

    const targetDir = `Data/${config.dialect}_${config.database}_testrun`;

    console.log('--- backup() ---');
    await driver.backup(targetDir);
    console.log('backup done:', targetDir);

    await driver.connect();

    console.log('--- verify() right after backup (should be PASS) ---');
    console.log(await driver.verify(targetDir));

    console.log('--- createSnapshot() ---');
    await driver.createSnapshot(`Rollback/${config.dialect}_${config.database}`);
    console.log('snapshot done');

    console.log('--- restore() ---');
    await driver.restore(targetDir);
    console.log('restore done');

    console.log('--- verify() after restore (should be PASS) ---');
    console.log(await driver.verify(targetDir));

    console.log('--- rollback() ---');
    await driver.rollback();
    console.log('rollback done');

    await driver.disconnect();
}

main().catch((err) => {
    console.error('FAILED:', err);
    process.exit(1);
});
