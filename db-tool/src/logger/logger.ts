import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';

// SINGLETON PATTERN: one logger instance for the whole app.
// Private constructor → no one can call `new Logger()`.
// The static `getInstance()` creates it once and returns the same one every time.

const LOG_DIR = path.resolve(process.cwd(), 'Logs');
fs.ensureDirSync(LOG_DIR); // create Logs/ if it doesn't exist yet

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console(), // always print to terminal
    new winston.transports.File({ filename: path.join(LOG_DIR, 'app.log') }),
  ],
});

// Export the single instance. Any file that imports this gets the SAME logger.
export default logger;
