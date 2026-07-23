import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';

// SINGLETON PATTERN: one logger instance for the whole app.
// Private constructor → no one can call `new Logger()`.
// The static `getInstance()` creates it once and returns the same one every time.

const LOG_DIR = path.resolve(process.cwd(), 'Logs');
fs.ensureDirSync(LOG_DIR); // create Logs/ if it doesn't exist yet

// shared "envelope" formatting — every log line, in every file, looks like:
// [2026-06-19 11:05:00] INFO message
const lineFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level.toUpperCase()} ${message}`;
});

// a "bouncer" — only lets a log line through to this transport if it was
// tagged with the matching action, e.g. logger.info('msg', { action: 'backup' }).
function forAction(action: string): winston.Logform.Format {
  return winston.format((info) => (info.action === action ? info : false))();
}

function actionFileTransport(action: string): winston.transport {
  return new winston.transports.File({
    filename: path.join(LOG_DIR, `${action}.log`),
    format: winston.format.combine(
      forAction(action),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      lineFormat,
    ),
  });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    lineFormat,
  ),
  transports: [
    new winston.transports.Console(), // always print to terminal
    new winston.transports.File({ filename: path.join(LOG_DIR, 'app.log') }), // everything, unfiltered
    actionFileTransport('backup'),
    actionFileTransport('restore'),
    actionFileTransport('rollback'),
    actionFileTransport('verify'),
  ],
});

// Export the single instance. Any file that imports this gets the SAME logger.
export default logger;
