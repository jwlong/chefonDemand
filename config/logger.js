import winston from 'winston'
import expressWinston from 'express-winston'
import 'winston-daily-rotate-file'
import path from 'path'

export let DailyRotateFileTransport = (fileName) => {
    return new (winston.transports.DailyRotateFile)({
        filename: path.join('logs', `${fileName}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD-HH',
        // maxSize: '20m',
        maxFiles: '7d',
        colorize: false,
        timestamp: () => new Date().format('yyyy-MM-dd HH:mm:ss.S')
    })
}

export let apiRequestLogger = (req, res, next) => {
    let send = res.send
    let content = ''
    let query = req.query || {}
    let body = req.body || {}
    res.send = function () {
        content = arguments[0]
        send.apply(res, arguments)
    }
    expressWinston.logger({
        transports: [
            DailyRotateFileTransport('api-request')
        ],
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg () {
            return `${new Date()} -- HTTP ${req.method} ${req.url} query ${JSON.stringify(query)} body ${JSON.stringify(body)} resData ${content} `
        },
        expressFormat: false,
        colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function (req, res) {
            if (req.headers.self) return true
            return false
        } // optional: allows to skip some log messages based on request and/or response
    })(req, res, next)
}