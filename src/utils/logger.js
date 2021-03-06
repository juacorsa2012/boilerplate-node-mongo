const fs = require('fs')
const path = require('path')
const { createLogger, format, transports } = require('winston')

const env = process.env.NODE_ENV
const logsDir = 'logs'
const filename = path.join(logsDir, 'app.log')

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

const logger = createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    }),
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename
    })
  ]
});

module.exports = logger