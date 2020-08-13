require('dotenv').config(); // 비밀번호를 dotenv로 옮김

module.exports = {
    development: {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'nodebird',
        host: '127.0.0.1',
        dialect: 'mysql',
        operatorsAlizses: false,
    },
    test: {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'nodebird',
        host: '127.0.0.1',
        dialect: 'mysql',
        operatorsAlizses: false,
    },
    production: {
        username: 'root',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'nodebird',
        host: '127.0.0.1',
        dialect: 'mysql',
        operatorsAlizses: false,
        logging: false,
    },
};
