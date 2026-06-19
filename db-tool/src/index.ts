import { loadConfig } from './config/config.loader';
import logger from './logger/logger';
import { showMenu } from './cli/menu';
import chalk from 'chalk';
import { createDriver } from './factory/DriverFactory';
import inquirer from 'inquirer';
import { addHistoryEntry, getHistory } from './utils/history';
import { classifyError } from './utils/errors';

async function main(): Promise<void> {
  const config = loadConfig();

  const driver = createDriver(config);

  logger.info(`Config loaded — dialect: ${config.dialect}, db: ${config.database}`);

  function reportFailure(actionLabel: string, error: unknown): void {
    const { category, message } = classifyError(error);
    console.log(chalk.red(`${actionLabel} failed: ${category} — ${message}`));
    logger.error(`${actionLabel} failed: ${category} — ${message}`, { action: actionLabel });
  }

  // show the menu until user picks Exit
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const action = await showMenu();

    if (action === 'exit') {
      console.log(chalk.green('Goodbye!'));
      process.exit(0); // stops the entire program
    }
    if (action === 'backup') {
      const { testConnection } = await inquirer.prompt<{ testConnection: boolean }>([
        { type: 'confirm', name: 'testConnection', message: 'Đồng ý Test Connection?' },
      ]);

      if (!testConnection) {
        continue;
      }

      console.log('Testing...');
      logger.info('Testing connection...', { action: 'backup' });
      const passed = await driver.test();
      console.log(passed ? chalk.green('Passed') : chalk.red('Failed'));
      logger.info(`Test connection: ${passed ? 'Passed' : 'Failed'}`, { action: 'backup' });

      if (!passed) {
        continue;
      }

      const { exportDb } = await inquirer.prompt<{ exportDb: boolean }>([
        { type: 'confirm', name: 'exportDb', message: 'Xuất Database?' },
      ]);

      if (!exportDb) {
        continue;
      }

      const targetDir = `Data/${config.dialect}_${config.database}_${Date.now()}`;
      logger.info(`Starting backup to ${targetDir}`, { action: 'backup' });

      try {
        await driver.backup(targetDir);
        console.log(chalk.green(`Backup completed: ${targetDir}`));
        logger.info(`Backup completed: ${targetDir}`, { action: 'backup' });
        await addHistoryEntry({ action: 'backup', database: config.database, status: 'SUCCESS' });
      } catch (error) {
        reportFailure('backup', error);
        await addHistoryEntry({ action: 'backup', database: config.database, status: 'FAILED' });
      }
    }

    if (action === 'restore') {
      const { sourceDir } = await inquirer.prompt<{ sourceDir: string }>([
        { type: 'input', name: 'sourceDir', message: 'Đường dẫn backup:' },
      ]);

      console.log('Testing...');
      logger.info('Testing connection...', { action: 'restore' });
      const passed = await driver.test();
      console.log(passed ? chalk.green('Passed') : chalk.red('Failed'));
      logger.info(`Test connection: ${passed ? 'Passed' : 'Failed'}`, { action: 'restore' });

      if (!passed) {
        continue;
      }

      await driver.connect();

      try {
        console.log('Taking safety snapshot...');
        logger.info('Taking safety snapshot...', { action: 'restore' });
        await driver.createSnapshot(`Rollback/${config.dialect}_${config.database}`);

        console.log('Restoring...');
        logger.info(`Restoring from ${sourceDir}`, { action: 'restore' });
        await driver.restore(sourceDir);

        console.log('Verifying...');
        const verified = await driver.verify(sourceDir);

        if (verified) {
          console.log(chalk.green('Success'));
          logger.info('Restore verified: PASS', { action: 'restore' });
          await addHistoryEntry({
            action: 'restore',
            database: config.database,
            status: 'SUCCESS',
          });
        } else {
          console.log(chalk.red('Verify failed — rolling back...'));
          logger.warn('Restore verify failed — rolling back...', { action: 'restore' });
          await driver.rollback();
          console.log(chalk.yellow('Rollback complete'));
          logger.info('Rollback complete', { action: 'rollback' });
          await addHistoryEntry({ action: 'restore', database: config.database, status: 'FAILED' });
        }
      } catch (error) {
        reportFailure('restore', error);

        try {
          await driver.rollback();
          console.log(chalk.yellow('Rollback complete'));
          logger.info('Rollback complete', { action: 'rollback' });
        } catch (rollbackError) {
          reportFailure('rollback', rollbackError);
        }

        await addHistoryEntry({ action: 'restore', database: config.database, status: 'FAILED' });
      } finally {
        await driver.disconnect();
      }
    }

    if (action === 'verify') {
      const { sourceDir } = await inquirer.prompt<{ sourceDir: string }>([
        { type: 'input', name: 'sourceDir', message: 'Đường dẫn backup:' },
      ]);

      await driver.connect();

      try {
        console.log('Verifying...');
        logger.info('Verifying...', { action: 'verify' });
        const verified = await driver.verify(sourceDir);
        console.log(verified ? chalk.green('PASS') : chalk.red('FAIL'));
        logger.info(`Verify result: ${verified ? 'PASS' : 'FAIL'}`, { action: 'verify' });
      } catch (error) {
        reportFailure('verify', error);
      } finally {
        await driver.disconnect();
      }
    }

    if (action === 'rollback') {
      const { confirmRollback } = await inquirer.prompt<{ confirmRollback: boolean }>([
        { type: 'confirm', name: 'confirmRollback', message: 'Rollback to last snapshot?' },
      ]);

      if (!confirmRollback) {
        continue;
      }

      await driver.connect();

      try {
        console.log('Rolling back...');
        logger.info('Rolling back...', { action: 'rollback' });
        await driver.rollback();
        console.log(chalk.green('Rollback complete'));
        logger.info('Rollback complete', { action: 'rollback' });
        await addHistoryEntry({ action: 'rollback', database: config.database, status: 'SUCCESS' });
      } catch (error) {
        reportFailure('rollback', error);
        await addHistoryEntry({ action: 'rollback', database: config.database, status: 'FAILED' });
      } finally {
        await driver.disconnect();
      }
    }

    if (action === 'history') {
      const history = await getHistory();

      if (history.length === 0) {
        console.log(chalk.gray('No history yet.'));
      } else {
        for (const entry of history) {
          const statusColor = entry.status === 'SUCCESS' ? chalk.green : chalk.red;
          console.log(
            `${entry.id}  ${entry.action.padEnd(8)}  ${entry.database.padEnd(12)}  ${statusColor(entry.status)}  ${entry.time}`,
          );
        }
      }
    }
  }
}

main().catch(console.error);
