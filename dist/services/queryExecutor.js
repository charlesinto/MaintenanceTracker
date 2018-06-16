'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _connectToDb = require('./connectToDb');

var _connectToDb2 = _interopRequireDefault(_connectToDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var executeQuery = function executeQuery(sql, params) {
    return new Promise(function (resolve, reject) {
        (0, _connectToDb2.default)().then(function (client, done) {
            if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== undefined && params.length > 0) {
                client.query(sql, params, function (err, result) {
                    if (err) {
                        console.log('err1', err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                client.query(sql, function (err, result) {
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