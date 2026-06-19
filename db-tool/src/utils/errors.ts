// sorts a raw error into one of the spec's error categories (section XVI),
// so the CLI can log/report something useful instead of a raw stack trace
export type ErrorCategory =
  | 'Connection Error'
  | 'Permission Error'
  | 'FK Error'
  | 'Disk Full'
  | 'Unknown Error';

export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
}

interface NodeErrorLike {
  code?: string;
  errno?: number;
  message?: string;
}

const FK_ERRNOS = [1451, 1452]; // mysql/mariadb: row referenced / no referenced row

export function classifyError(error: unknown): ClassifiedError {
  const err = error as NodeErrorLike;
  const message = err?.message ?? String(error);

  if (err?.code === 'ENOSPC') {
    return { category: 'Disk Full', message };
  }

  if (err?.code === 'EACCES' || err?.code === 'EPERM') {
    return { category: 'Permission Error', message };
  }

  if (
    err?.code === 'ECONNREFUSED' ||
    err?.code === 'ETIMEDOUT' ||
    err?.code === 'PROTOCOL_CONNECTION_LOST'
  ) {
    return { category: 'Connection Error', message };
  }

  if (err?.errno !== undefined && FK_ERRNOS.includes(err.errno)) {
    return { category: 'FK Error', message };
  }

  return { category: 'Unknown Error', message };
}
