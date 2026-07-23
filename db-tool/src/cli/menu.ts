import inquirer from 'inquirer';
import chalk from 'chalk';

// prevents typos when checking the result.
export type MenuAction = 'backup' | 'restore' | 'verify' | 'rollback' | 'history' | 'exit';

// đổi màu
function printBanner(): void {
  console.log(chalk.cyan('\n================================'));
  console.log(chalk.cyan.bold('        Database Tool'));
  console.log(chalk.cyan('================================\n'));
}

export async function showMenu(): Promise<MenuAction> {
  printBanner();

  const { action } = await inquirer.prompt<{ action: MenuAction }>([
    {
      type: 'list', // tạo input cho list
      name: 'action', // key in the returned object
      message: 'Select:',
      choices: [
        { name: '1. Backup', value: 'backup' },
        { name: '2. Restore', value: 'restore' },
        { name: '3. Verify', value: 'verify' },
        { name: '4. Rollback', value: 'rollback' },
        { name: '5. History', value: 'history' },
        { name: '6. Exit', value: 'exit' },
      ],
    },
  ]);

  return action;
}
