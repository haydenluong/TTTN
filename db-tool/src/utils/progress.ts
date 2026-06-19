// tracks which tables a restore has already completed, so an interrupted
// restore can resume instead of starting over from the first table
import * as fs from 'fs-extra';
import * as path from 'path';

function progressFile(sourceDir: string): string {
  return path.join(sourceDir, '.restore-progress.json');
}

export async function readProgress(sourceDir: string): Promise<string[]> {
  const file = progressFile(sourceDir);
  if (!(await fs.pathExists(file))) {
    return [];
  }
  return fs.readJson(file) as Promise<string[]>;
}

export async function markTableDone(sourceDir: string, table: string): Promise<void> {
  const done = await readProgress(sourceDir);
  done.push(table);
  await fs.writeJson(progressFile(sourceDir), done);
}

export async function clearProgress(sourceDir: string): Promise<void> {
  await fs.remove(progressFile(sourceDir));
}
