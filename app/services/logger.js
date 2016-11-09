const winston = require('winston'),
    dailyRotateFile = require('winston-daily-rotate-file'),
    transports = [
        new (winston.transports.Console)({
            json: false,
            timestamp: true,
            level: 'debug'
        })
    ],
    exceptionHandlers = [
        new (winston.transports.Console)({
            json: false,
            timestamp: true,
            level: 'debug' })
    ];

transports.push(
    new (dailyRotateFile)({
        colorize: 'true',
        filename: 'debug.log',
        dirname: process.env.NODE_LOG_DIRECTORY,
        datePattern: '.yyyy-MM-dd',
        maxsize: 20000
    })
);

exceptionHandlers.push(
    new winston.transports.File({
        filename: 'exceptions.log',
        dirname: process.env.NODE_LOG_DIRECTORY,
        maxsize: 20000
    })
);

module.exports = new (winston.Logger)({
    transports: transports ,
    exceptionHandlers: exceptionHandlers,
    exitOnError: true
});