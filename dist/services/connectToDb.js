'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _DataBaseConnection = require('../DataBaseConnection');

var _DataBaseConnection2 = _interopRequireDefault(_DataBaseConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectToDb = function connectToDb() {
    return new Promise(function (resolve, reject) {
        _DataBaseConnection2.default.connect(function (err, client, done) {
            if (err) {
                reject(err);
            } else {
                resolve(client, done);
            }
        });
    });
};

exports.default = connectToDb;