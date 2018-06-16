'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
var pool = void 0;
console.log('env', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'DEVELOPMENT') {
    pool = new _pg2.default.Pool(config);
    var config = {
        user: 'postgres',
        database: 'Ledger',
        password: 'pa$$word123',
        port: 5432,
        max: 10, // max number of connection can be open to database
        idleTimeoutMillis: 30000
    };
    pool = new _pg2.default.Pool(config);
} else if (process.env.NODE_ENV === 'TEST') {
    var _config = {
        user: 'postgres',
        database: 'mTracker-test',
        password: 'pa$$word123',
        port: 5432,
        max: 10, // max number of connection can be open to database
        idleTimeoutMillis: 30000
    };
    pool = new _pg2.default.Pool(_config);
} else {
    console.log('ysing production');
    pool = new _pg2.default.Pool({
        connectionString: process.env.DATABSE_URL, ssl: true
    });
}

//const config_online = process.env.DATABASE_URL;


exports.default = pool;