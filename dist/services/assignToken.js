'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assignToken = function assignToken(payload) {
    return new Promise(function (resolve, reject) {
        _jsonwebtoken2.default.sign(payload, process.env.SECRET_KEY, { expiresIn: '6h' }, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};
exports.default = assignToken;