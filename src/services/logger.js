import { getLocalDate } from './utils'
require('dotenv').config()
// const fecha = require('fecha')
const appRoot = require('app-root-path')
const winston = require('winston')
require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    info => {
      const localDate = getLocalDate()
      return `${localDate} | ${info.level} | ${info.message}`
    }
  ),
)

const getLogPath = () => {
  let logPath = process.env.LOG_PATH
  if (typeof logPath === 'undefined' || logPath == null || logPath === '') {
    logPath = [appRoot.path, 'logs'].join('/')
  }
  return logPath
}

const config = {
  file: {
    level: 'info',
    filename: `${getLogPath()}/logs_gateway_app.log.%DATE%`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    handleRejections: true
  },
  error: {
    level: 'error',
    filename: `${getLogPath()}/logs_gateway_error.log.%DATE%`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: false,
    handleRejections: true
  },
  debug: {
    level: 'debug',
    filename: `${getLogPath()}/logs_gateway_debug.log.%DATE%`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: false,
    handleRejections: false
  },
}

const allLogsFileTransport = new winston.transports.DailyRotateFile(config.file)
const errorLogsFileTransport = new winston.transports.DailyRotateFile(config.error)
const debugTransport = new winston.transports.DailyRotateFile(config.debug)
// const rejectionTransport = new winston.transports.DailyRotateFile(config.rejection)

const options = {
  format: logFormat,
  transports: [allLogsFileTransport, errorLogsFileTransport, debugTransport],
  // rejectionHandlers: [rejectionTransport],
  exitOnError: false,
}

export const logger = winston.createLogger(options)
