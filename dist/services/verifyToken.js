'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var veryifyToken = function veryifyToken(req, res, next) {
    var token = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
    var bearerHeader = req.body.token || req.headers['authorization'];

    if (!bearerHeader) {
        res.status(401).send({
            message: 'Unauthorized user'
        });
    } else if ((typeof bearerHeader === 'undefined' ? 'undefined' : _typeof(bearerHeader)) !== undefined) {
        _jsonwebtoken2.default.verify(bearerHeader, token, function (err, authData) {
            if (err) {
                res.status(403).send({
                    message: "Forbidden access"
                });
            }
            req.token = authData;
            next();
        });
    }
};

exports.default = veryifyToken;