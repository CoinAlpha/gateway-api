import { getLocalDate } from './utils';
const appRoot = require('app-root-path');
const winston = require('winston');
require('winston-daily-rotate-file');
const globalConfig =
  require('../services/configuration_manager').configManagerInstance;

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const localDate = getLocalDate();
    return `${localDate} | ${info.level} | ${info.message}`;
  })
);

const getLogPath = () => {
  let logPath = globalConfig.getConfig('LOG_PATH');
  if (typeof logPath === 'undefined' || logPath == null || logPath === '') {
    logPath = [appRoot.path, 'logs'].join('/');
  }
  return logPath;
};

const config = {
  file: {
    level: 'info',
    filename: `${getLogPath()}/logs_gateway_app.log.%DATE%`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    handleRejections: true,
  },
};

const allLogsFileTransport = new winston.transports.DailyRotateFile(
  config.file
);

const options = {
  format: logFormat,
  transports: [allLogsFileTransport],
  exitOnError: false,
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export { logger };
