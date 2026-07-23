import * as fs from 'fs-extra';
import * as path from 'path';

export interface HistoryEntry {
  id: string;
  action: string;
  database: string;
  status: 'SUCCESS' | 'FAILED';
  time: string;
}

const HISTORY_FILE = path.join('Logs', 'history.json');

export async function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'time'>): Promise<void> {
  const history = await getHistory();

  const newEntry: HistoryEntry = {
    id: String(history.length + 1).padStart(3, '0'),
    time: new Date().toISOString(),
    ...entry,
  };

  history.push(newEntry);

  await fs.ensureDir(path.dirname(HISTORY_FILE));
  await fs.writeJson(HISTORY_FILE, history, { spaces: 2 });
}

export async function getHistory(): Promise<HistoryEntry[]> {
  if (!(await fs.pathExists(HISTORY_FILE))) {
    return [];
  }

  return fs.readJson(HISTORY_FILE);
}
