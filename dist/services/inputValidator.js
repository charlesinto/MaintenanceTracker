'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inputValidator = function inputValidator(res, obj) {
    if (typeof obj !== "undefined" && obj !== '' && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.length === "undefined") {

        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === 'firstname' || keys[i] === 'lastname') {
                if (_typeof(obj[keys[i]]) === undefined || obj[keys[i]] === '' || /[@!#$%^&*()\d~`<>?":{}+=?/]/i.test(obj[keys[i]])) {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({ message: keys[i] + '  required and no special character allowed' });
                    return false;
                }
            }
            if (keys[i] === 'phonenumber') {
                if (typeof obj[keys[i]] === "undefined" || obj[keys[i]] === '' || !_validator2.default.isNumeric(obj[keys[i]]) || obj[keys[i]].length < 11) {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({ message: keys[i] + '  required and must be numbers of 11 digits' });
                    return false;
                }
            }
            if (keys[i] === 'email') {

                if (!_validator2.default.isEmail(obj[keys[i]])) {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({ message: keys[i] + '  required and must be in valid format' });
                    return false;
                }
            } else if (typeof obj[keys[i]] === "undefined" || obj[keys[i]] === '') {
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.json({ message: keys[i] + ' required' });
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};

exports.default = inputValidator;