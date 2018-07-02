'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _connectToDb = require('./connectToDb');

var _connectToDb2 = _interopRequireDefault(_connectToDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var executeQuery = function executeQuery(sql, params) {
    return new Promise(function (resolve, reject) {
        (0, _connectToDb2.default)().then(function (client, done) {
            if (typeof params !== "undefined" && params.length > 0) {
                client.query(sql, params, function (err, result) {
                    client.release();
                    if (err) {
                        console.log('err1', err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                client.query(sql, function (err, result) {
                    client.release();
                    if (err) {
                        console.log('err1', err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        }).catch(function (err) {
            console.log('err2', err);
            reject(err);
        });
    });
};

exports.default = executeQuery;