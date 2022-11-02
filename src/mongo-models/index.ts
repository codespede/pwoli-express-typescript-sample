console.log('eewwwwwwwwwwww')
const mongoose = require('mongoose');
const config = {
    DB_USERNAME: '',
    DB_PASSWORD: '',
    DB_DATABASE: 'pwoli_test',
    DB_HOST: '127.0.0.1',
    DB_PORT: 27017,
    NODE_ENV: 'development'
};

const usernamePassword = config.DB_USERNAME === '' || config.DB_PASSWORD === '' ? "" : `${config.DB_USERNAME}:${config.DB_PASSWORD}@`;
const mongoDB = `mongodb://${usernamePassword}${config.DB_HOST}:${config.DB_PORT}/${config.DB_DATABASE}` + `?authSource=${config.DB_DATABASE}&w=1`;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true}, () => {
    
})
mongoose.set('debug', true);
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
export default {}