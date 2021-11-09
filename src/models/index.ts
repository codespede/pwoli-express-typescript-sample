const pkg = require('sequelize');
const config = {
    "username": 'root2',
    "password": 'root',
    "database": 've',
    "host": '127.0.0.1',
    "dialect": "mysql"
};
const { Sequelize } = pkg;
let sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);
sequelize.sync()
export default sequelize;
