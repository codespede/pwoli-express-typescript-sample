import { Sequelize } from 'sequelize';
const jsonConfig = require("../../config/config.json")['development'];
let sequelize;
const config = {
    "username": jsonConfig.username,
    "password": jsonConfig.password,
    "database": jsonConfig.database,
    "host": '127.0.0.1',
    "dialect": "mysql"
};
export default sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config as any
);
sequelize.sync()
