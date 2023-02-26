const {createLogger, format, transports} = require("winston");

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        //format.json(),
        //format.align(),
        format.printf(debug => `${[debug.timestamp]}: ${debug.message}`)
      ),
    transports: [
      new transports.File({ filename: './logs/error.log', level: 'error' }),
      new transports.File({ filename: './logs/combined.log' })
    ]
  });

  module.exports = logger;