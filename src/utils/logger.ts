import winston from 'winston';
import { config, Environment } from '../config/env.config';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-mm-dd HH:mm' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: 'src/logs/error.log',
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: `src/logs/${config.logging.logFilename}`,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

if (config.app.env !== Environment.PROD) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
