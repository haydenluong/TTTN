import { loadConfig } from './config/config.loader';
import logger from './logger/logger';
import { showMenu } from './cli/menu';
import chalk from 'chalk';
import { createDriver } from './factory/DriverFactory';
import inquirer from 'inquirer';
import { addHistoryEntry, getHistory } from './utils/history';

async function main(): Promise<void> {
  const config = loadConfig();

  const driver = createDriver(config);
  
  logger.info(`Config loaded — dialect: ${config.dialect}, db: ${config.database}`);
  
  // show the menu until user picks Exit 
  while (true) {

    const action = await showMenu();

    if (action === 'exit') {
      console.log(chalk.green('Goodbye!'));
      process.exit(0); // stops the entire program
    }
    if (action === 'backup') {
      const { testConnection } = await inquirer.prompt<{testConnection: boolean}>([
        {type: 'confirm',
        name: 'testConnection',
        message: 'Đồng ý Test Connection?'
        },
      ]);

      if (!testConnection) {
        continue 
      }

      console.log('Testing...');
      const passed = await driver.test();
      console.log(passed ? chalk.green('Passed') : chalk.red('Failed'));

      if (!passed) {
        continue;
      }

      const { exportDb } = await inquirer.prompt<{exportDb: boolean}>([
        {type: 'confirm',
        name: 'exportDb',
        message: 'Xuất Database?'
        },
      ]);

      if (!exportDb) {
        continue;
      }

      const targetDir = `Data/${config.dialect}_${config.database}_${Date.now()}`;
      await driver.backup(targetDir);
      console.log(chalk.green(`Backup completed: ${targetDir}`));

      await addHistoryEntry({ action: 'backup', database: config.database, status: 'SUCCESS' });
    }
  
    if (action === 'restore') {
      const { sourceDir } = await inquirer.prompt<{ sourceDir: string }>([
        { type: 'input', name: 'sourceDir', message: 'Đường dẫn backup:' },
    ]);

    console.log('Testing...');
    const passed = await driver.test();
    console.log(passed ? chalk.green('Passed') : chalk.red('Failed'));

    if (!passed) {
        continue;
    }

    await driver.connect();

    console.log('Taking safety snapshot...');
    await driver.createSnapshot(`Rollback/${config.dialect}_${config.database}`);

    console.log('Restoring...');
    await driver.restore(sourceDir);

    console.log('Verifying...');
    const verified = await driver.verify();

    if (verified) {
        console.log(chalk.green('Success'));
        await addHistoryEntry({ action: 'restore', database: config.database, status: 'SUCCESS' });
    } else {
        console.log(chalk.red('Verify failed — rolling back...'));
        await driver.rollback();
        console.log(chalk.yellow('Rollback complete'));
        await addHistoryEntry({ action: 'restore', database: config.database, status: 'FAILED' });
    }

    await driver.disconnect();
    }

    if (action === 'verify') {
      await driver.connect();

      console.log('Verifying...');
      const verified = await driver.verify();
      console.log(verified ? chalk.green('PASS') : chalk.red('FAIL'));

      await driver.disconnect();
    }

    if (action === 'rollback') {
      const { confirmRollback } = await inquirer.prompt<{ confirmRollback: boolean }>([
        { type: 'confirm', name: 'confirmRollback', message: 'Rollback to last snapshot?' },
      ]);

      if (!confirmRollback) {
        continue;
      }
      
      await driver.connect();

      console.log('Rolling back...');
      await driver.rollback();
      console.log(chalk.green('Rollback complete'));

      await addHistoryEntry({ action: 'rollback', database: config.database, status: 'SUCCESS' });

      await driver.disconnect();
    }

    if (action === 'history') {
      const history = await getHistory();

      if (history.length === 0) {
        console.log(chalk.gray('No history yet.'));
      } else {
        for (const entry of history) {
          const statusColor = entry.status === 'SUCCESS' ? chalk.green : chalk.red;
          console.log(
            `${entry.id}  ${entry.action.padEnd(8)}  ${entry.database.padEnd(12)}  ${statusColor(entry.status)}  ${entry.time}`
          );
        }
      }
    }
  }
}

main().catch(console.error);