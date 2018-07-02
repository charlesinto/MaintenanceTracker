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
        max: 20, // max number of connection can be open to database
        idleTimeoutMillis: 50000
    };
    pool = new _pg2.default.Pool(config);
} else if (process.env.NODE_ENV === 'TEST') {
    // console.log('using test')
    // const config = {
    //     user: 'postgres',
    //     database: 'mTracker-test', 
    //     password: 'pa$$word123', 
    //     port: 5432, 
    //     max: 10, // max number of connection can be open to database
    //     idleTimeoutMillis: 30000,
    // };
    var TEST_DB = "postgres:fexheyoxndtkky:634e245a0e1d69ebf4d1d9104e6cbde22e81e8d030b88dcbca3393bedb75febd@ec2-54-83-59-120.compute-1.amazonaws.com:5432/d84nu2ldeehl1j";
    //   pool = new pg.Pool(config);
    pool = new _pg2.default.Pool({
        connectionString: TEST_DB, ssl: true
    });
} else if (process.env.NODE_ENV === 'PRODUCTION') {
    var conDb = 'postgres://jchegnjhbpztbl:80ddd4918f6d9897bc94ffd66995759c23f1bec43dab5ab01f2ab0642d478513@ec2-54-225-107-174.compute-1.amazonaws.com:5432/d1h9n7k7aok7gd';
    pool = new _pg2.default.Pool({
        connectionString: conDb, ssl: true
    });
}
exports.default = pool;