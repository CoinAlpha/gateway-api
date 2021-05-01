import { getLocalDate } from '../utils';
import appRoot from 'app-root-path';
import winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const localDate = getLocalDate();
    return `${localDate} | ${info.level} | ${info.message}`;
  })
);

const getLogPath = (): string => {
  let logPath = process.env.LOG_PATH;
  if (!logPath) {
    logPath = [appRoot.path, 'logs'].join('/');
  }
  return logPath;
};

const allLogsFileTransport = new winston.transports.DailyRotateFile({
  level: 'info',
  dirname: getLogPath(),
  filename: 'logs_gateway_app.log.%DATE%',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
});

export const logger = winston.createLogger({
  format: logFormat,
  transports: [allLogsFileTransport],
  exitOnError: false,
});

export const debug = winston.createLogger({
  format: logFormat,
  transports: [new winston.transports.Console({ level: 'warn' })],
  exitOnError: false,
});
