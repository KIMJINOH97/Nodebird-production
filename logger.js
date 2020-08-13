const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    // 파일로 기록됨
    level: 'info',
    format: format.json(),
    transports: [new transports.File({ filename: 'combined.log' }), new transports.File({ filename: 'error.log', level: 'error' })],
});

if (process.env.NODE_ENV !== 'production') {
    // 배포가 아닐 땐 콘솔에 기록
    logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;
