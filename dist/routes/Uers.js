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

router.get('/requests', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined") {
        var loggedInUser = req.token;
        var sql = 'SELECT * FROM BASE_REQUEST WHERE user_id = $1';
        (0, _queryExecutor2.default)(sql, [loggedInUser.id]).then(function (result) {
            var r1 = result;
            var sql = 'SELECT * FROM BASE_ITEM_CATEGORY';
            var sql1 = 'SELECT * FROM BASE_ITEM';
            (0, _queryExecutor2.default)(sql).then(function (result) {
                var dataSet1 = result.rows;
                (0, _queryExecutor2.default)(sql1).then(function (result) {
                    var dataSet2 = result.rows;
                    if (r1.rowCount > 0) {
                        res.statusCode = 200;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation successful',
                            requests: r1.rows,
                            dataSet1: dataSet1,
                            dataSet2: dataSet2
                        });
                    } else {
                        res.statusCode = 404;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'No record found',
                            requests: r1.rows,
                            dataSet1: dataSet1,
                            dataSet2: dataSet2
                        });
                    }
                }).catch(function (err) {
                    if (r1 > 0) {
                        res.statusCode = 200;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'operation successful',
                            requests: result.rows,
                            dataSet1: dataSet1,
                            err: err
                        });
                    } else {
                        res.statusCode = 404;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message: 'No record found',
                            requests: result.rows,
                            dataSet1: dataSet1,
                            err: err
                        });
                    }
                });
            }).catch(function (err) {
                if (r1 > 0) {
                    res.statusCode = 200;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'operation successful',
                        requests: result.rows,
                        err: err
                    });
                } else {
                    res.statusCode = 404;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'No record found',
                        requests: result.rows,
                        err: err
                    });
                }
            });
        }).catch(function (err) {
            console.log('not here');
            res.statusCode = 404;
            console.log('err', err);
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'No record found'
            });
        });
    }
});
router.delete('/request/:id', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined" || req.token !== '') {
        var user = req.token;
        var request_id = parseInt(req.params.id);
        var sql = 'DELETE FROM BASE_REQUEST WHERE id = $1 AND USER_ID = $2';
        (0, _queryExecutor2.default)(sql, [request_id, user.id]).then(function (result) {
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: "Record deleted Sucessfully"
            });
        }).catch(function (err) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: "Service not available"
            });
        });
    }
});
router.get('/request/:id', _verifyToken2.default, function (req, res) {
    if (typeof req.params !== "undefined" && req.params !== '') {
        var request_id = parseInt(req.params.id);
        var sql = 'SELECT * FROM BASE_REQUEST WHERE id = $1';
        (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            if (result.rowCount > 0) {
                res.json({
                    message: 'operation successful',
                    requests: result.rows
                });
            } else {
                res.json({
                    message: 'No record found',
                    requests: result.rows
                });
            }
        }).catch(function (err) {
            res.statusCode = 404;
            res.setHeader('content-type', 'application/json');
            res.json({
                message: 'No record found'
            });
        });
    }
});
router.post('/request', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined" && req.token !== '') {
        var user = req.token;
        var request = (0, _trimWhiteSpace2.default)(req.body);
        if (!(0, _validateKeys2.default)(request, ['item', 'itemcategory', 'requestcategory', 'complaints'])) {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({ message: 'Bad Request,one or more keys is missing' });
        }
        if ((0, _inputValidator2.default)(res, request)) {
            var sql = 'INSERT INTO BASE_REQUEST(requestcategory,item, itemcategory,complaints, user_id, status, datecreated) values ($1,$2,$3,$4,$5,$6,$7)';
            (0, _queryExecutor2.default)(sql, [request.requestcategory, request.item, request.itemcategory, request.complaints, user.id, 'PENDING', 'NOW()']).then(function (result) {

                var sql = 'SELECT * FROM BASE_REQUEST WHERE datecreated = (SELECT MAX(datecreated) FROM BASE_REQUEST WHERE user_id = $1)';
                (0, _queryExecutor2.default)(sql, [user.id]).then(function (result) {
                    res.statusCode = 201;
                    res.setHeader('content-type', 'application/json');
                    return res.json({
                        message: 'operation successful',
                        request: request,
                        newRequest: result.rows
                    });
                }).catch(function (err) {
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'couldnt perform action',
                        err: err
                    });
                });
            }).catch(function (err) {
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.json({
                    message: 'couldnt perform action',
                    err: err
                });
            });
        }
    }
});
router.put('/request/:id', _verifyToken2.default, function (req, res) {
    if (typeof req.token !== "undefined") {
        var user = req.token;
        var request = (0, _trimWhiteSpace2.default)(req.body);
        if (!(0, _validateKeys2.default)(request, ['complaints'])) {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({ message: 'Bad Request,one or more keys is missing or has more keys than expected' });
        }
        if ((0, _inputValidator2.default)(res, request)) {
            var request_id = parseInt(req.params.id);
            if (typeof request_id !== "undefined" && request_id !== '') {
                var sql = 'SELECT * FROM BASE_REQUEST WHERE id = $1';
                (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
                    if (result.rowCount > 0) {
                        if (result.rows[0].status !== 'PENDING') {
                            res.statusCode = 400;
                            res.setHeader('content-type', 'application/json');
                            return res.json({
                                message: 'can\'t perform update on request '
                            });
                        }
                        var _sql = 'UPDATE BASE_REQUEST SET complaints = $1 WHERE id = $2';
                        (0, _queryExecutor2.default)(_sql, [request.complaints, request_id]).then(function (result) {
                            var sql = 'SELECT * FROM BASE_REQUEST WHERE id = $1';
                            (0, _queryExecutor2.default)(sql, [request_id]).then(function (result) {
                                res.statusCode = 200;
                                res.setHeader('content-type', 'application/json');
                                res.json({
                                    message: 'operation successful',
                                    request: result.rows
                                });
                            }).catch(function (err) {
                                res.statusCode = 400;
                                res.setHeader('content-type', 'application/json');
                                res.json({
                                    message: 'couldn\'t update record',
                                    err: err
                                });
                            });
                        }).catch(function (err) {
                            res.statusCode = 400;
                            res.setHeader('content-type', 'application/json');
                            res.json({
                                message: 'couldnt perform operation',
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
                    res.statusCode = 500;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message: 'Server error',
                        err: err
                    });
                });
            } else {
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.json({
                    message: 'invalid params'
                });
            }
        }
    }
});

exports.default = router;