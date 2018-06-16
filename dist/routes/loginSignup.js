'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _assignToken = require('../services/assignToken');

var _assignToken2 = _interopRequireDefault(_assignToken);

var _trimWhiteSpace = require('../services/trimWhiteSpace');

var _trimWhiteSpace2 = _interopRequireDefault(_trimWhiteSpace);

var _verifyToken = require('../services/verifyToken');

var _verifyToken2 = _interopRequireDefault(_verifyToken);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _validateKeys = require('../services/validateKeys');

var _validateKeys2 = _interopRequireDefault(_validateKeys);

var _inputValidator = require('../services/inputValidator');

var _inputValidator2 = _interopRequireDefault(_inputValidator);

var _queryExecutor = require('../services/queryExecutor');

var _queryExecutor2 = _interopRequireDefault(_queryExecutor);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/login', function (req, res, next) {
    //    res.statusCode = 201;
    //    res.setHeader('content-type', 'application/json');
    //    res.json({
    //        message:'login successful'
    //    }) 
    next();
});
router.post('/signup', function (req, res) {
    var request = (0, _trimWhiteSpace2.default)(req.body);
    console.log('req.body', request);
    if (!(0, _validateKeys2.default)(request, ['firstname', 'lastname', 'email', 'password', 'phonenumber'])) {
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.json({ message: 'Bad Request,one or more keys is missing' });
    }
    if ((0, _inputValidator2.default)(res, request)) {
        var hashpassword = _bcrypt2.default.hashSync(request.password, 10);
        var sql = 'SELECT * FROM BASE_USERS WHERE email = $1';
        (0, _queryExecutor2.default)(sql, [request.email]).then(function (result) {
            if (result.rowCount > 0) {
                res.statusCode = 406;
                res.setHeader('content-type', 'application/json');
                return res.json({
                    message: 'User already exists'
                });
            } else {
                var _sql = 'INSERT INTO BASE_USERS(firstname,lastname,email,phonenumber,password,role_id,DATECREATED) values($1,$2,$3,$4,$5,$6,$7)';
                (0, _queryExecutor2.default)(_sql, [request.firstname, request.lastname, request.email, request.phonenumber, hashpassword, 1, 'NOW()']).then(function (result) {
                    (0, _assignToken2.default)({ firstname: request.firstname, lastname: request.lastname, role_id: 1, email: request.email }).then(function (token) {
                        res.statusCode = 201;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'welcome ' + request.firstname + ' ' + request.lastname,
                            token: token
                        });
                    }).catch(function (err) {
                        res.statusCode = 403;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'couldnt perform authentication',
                            err: err
                        });
                    });
                }).catch(function (err) {
                    res.statusCode = 500;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'Server error or service unavailabe',
                        err: err
                    });
                });
            }
        }).catch(function (err) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'Server error or service unavailabe',
                err: err
            });
        });
    }
});

exports.default = router;