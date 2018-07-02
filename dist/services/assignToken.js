'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assignToken = function assignToken(payload) {
    var token = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
    return new Promise(function (resolve, reject) {
        _jsonwebtoken2.default.sign(payload, token, { expiresIn: '7 days' }, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};
exports.default = assignToken;