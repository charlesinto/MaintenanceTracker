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

var ADMIN_ROLE = 2;
var router = _express2.default.Router();

router.get('/', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined" && req.token !== '') {
        var user = req.token;
        if (!(user.role_id == ADMIN_ROLE)) {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                message: 'access denied'
            });
        }
        var sql = 'SELECT * FROM BASE_REQUEST';
        (0, _queryExecutor2.default)(sql, '').then(function (result) {
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'operation successful',
                requests: result.rows
            });
        }).catch(function (err) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'operation failed',
                err: err
            });
        });
    }
});

router.put('/:id/resolve', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined" && typeof req.params.id !== "undefined" && req.params.id !== '') {
        var user = req.token;
        var request_id = parseInt(req.params.id);
        var sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
        (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
            if (result.rowCount > 0) {
                if (result.rows[0].status === 'REJECTED') {
                    res.statusCode = 406;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        message: 'can perform operation'
                    });
                }
                var _sql = 'UPDATE BASE_REQUEST SET status = $1 where id = $2';
                (0, _queryExecutor2.default)(_sql, ['RESOLVED', request_id]).then(function (result) {
                    var sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
                    (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
                        res.statusCode = 200;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation successful',
                            request: result.rows
                        });
                    }).catch(function (err) {
                        res.statusCode = 444;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation failed',
                            err: err
                        });
                    });
                }).catch(function (err) {
                    res.statusCode = 444;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'operation failed',
                        err: err
                    });
                });
            } else {
                res.statusCode = 404;
                res.setHeader('content-type', 'application/json');
                res.json({
                    message: 'No record found'
                });
            }
        }).catch(function (err) {
            res.statusCode = 444;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'operation failed',
                err: err
            });
        });
    }
});
router.put('/:id/reject', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined" && typeof req.params.id !== "undefined" && req.params.id !== '') {
        var user = req.token;
        var request_id = parseInt(req.params.id);
        var sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
        (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
            if (result.rowCount > 0) {
                if (result.rows[0].status === 'RESOLVED') {
                    res.statusCode = 406;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        message: 'can\'t update status'
                    });
                }
                var _sql2 = 'UPDATE BASE_REQUEST SET status = $1 where id = $2';
                (0, _queryExecutor2.default)(_sql2, ['REJECTED', request_id]).then(function (result) {
                    var sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
                    (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
                        res.statusCode = 200;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation successful',
                            request: result.rows
                        });
                    }).catch(function (err) {
                        res.statusCode = 444;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation failed',
                            err: err
                        });
                    });
                }).catch(function (err) {
                    res.statusCode = 444;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'operation failed',
                        err: err
                    });
                });
            } else {
                res.statusCode = 404;
                res.setHeader('content-type', 'application/json');
                res.json({
                    message: 'No record found'
                });
            }
        }).catch(function (err) {
            res.statusCode = 444;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'operation failed',
                err: err
            });
        });
    }
});
router.put('/:id/approve', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined" && typeof req.params.id !== "undefined" && req.params.id !== '') {
        var user = req.token;
        var request_id = parseInt(req.params.id);
        var sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
        (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
            if (result.rowCount > 0) {
                if (result.rows[0].status !== 'PENDING') {
                    res.statusCode = 406;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        message: 'can\'t update status'
                    });
                }
                var _sql3 = 'UPDATE BASE_REQUEST SET status = $1 where id = $2';
                (0, _queryExecutor2.default)(_sql3, ['APPROVED', request_id]).then(function (result) {
                    var sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
                    (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
                        res.statusCode = 200;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation successful',
                            request: result.rows
                        });
                    }).catch(function (err) {
                        res.statusCode = 444;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation failed',
                            err: err
                        });
                    });
                }).catch(function (err) {
                    res.statusCode = 444;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'operation failed',
                        err: err
                    });
                });
            } else {
                res.statusCode = 404;
                res.setHeader('content-type', 'application/json');
                res.json({
                    message: 'No record found'
                });
            }
        }).catch(function (err) {
            res.statusCode = 444;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'operation failed',
                err: err
            });
        });
    }
});
exports.default = router;