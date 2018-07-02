'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should();
var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

var loggedInToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiY2hhcmxlcyIsImxhc3RuYW1lIjoib251b3JhaCIsInJvbGVfaWQiOjEsImVtYWlsIjoibGluYWVrZWhAZ21haWwuY29tIiwiaWF0IjoxNTI5MjYxNzk1LCJleHAiOjE1Mjk4NjY1OTV9.75NoXO4VF0aMD4DYM99F3FYpsOux4BCI5XKQSAkV31Q";
var loginUser = {
    "email": "linaekeh@gmail.com",
    "password": "3450"
};
var user = {
    "firstname": "    charles",
    "lastname": "   onuorah    ",
    "email": " linaekeh@gmail.com",
    "password": " 3450  ",
    "phonenumber": "   08163113450"
};
var request = {
    "item": "laptop",
    "itemcategory": "electronics",
    "requestcategory": "repairs",
    "complaints": "faulty mousepad"

};
var updateRequest = {
    "complaints": "faulty speaker"
};
describe('Test all api end points', function () {
    describe('It should sign up user', function () {
        this.timeout(20000);
        it('response should have a status of 406', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signup').type('form').send(user).end(function (err, res) {
                expect(res).to.have.status(406);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signup').type('form').send(user).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signup').type('form').send(user).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message and token', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signup').type('form').send(user).end(function (err, res) {
                expect(res.body).to.have.own.property('message');
                done();
            });
        });
        it('response.message to be signup successful', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signup').type('form').send(user).end(function (err, res) {
                expect(res.body).to.deep.equal({ message: 'User already exists' });
                done();
            });
        });
    });
    describe('it should login a user', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/login').type('form').send(loginUser).end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/login').type('form').send(loginUser).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/login').type('form').send(loginUser).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message and token', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/login').type('form').send(loginUser).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response.message to be welcome', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/login').type('form').send(loginUser).end(function (err, res) {

                expect(res.body.message).to.equal("welcome");
                done();
            });
        });
    });
    describe('it should get all requests of a user', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/users/requests').set('authorization', loggedInToken).end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/users/requests').set('authorization', loggedInToken).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property requests', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('requests');
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an array', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function (err, res) {

                expect(res.body.requests).to.be.an('array');
                done();
            });
        });
    });
    describe('it should get a request of a user', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/request/1').set('authorization', loggedInToken).end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/request/1').set('authorization', loggedInToken).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property requests', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('requests');
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an array', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function (err, res) {

                expect(res.body.requests).to.be.an('array');
                done();
            });
        });
    });
    describe('it should create a new request', function () {
        this.timeout(20000);
        it('response should have a status of 201', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {

                expect(res).to.have.status(201);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property requests', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {
                expect(res.body).to.have.property('request');
                done();
            });
        });
        it('response.message to be a string', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {

                expect(res.body.message).to.be.string;
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an object', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function (err, res) {

                expect(res.body.request).to.be.an('object');
                done();
            });
        });
    });
    describe('it should modify a request', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/7').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/9').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/6').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/3').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property requests', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/40').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {
                expect(res.body).to.have.property('request');
                done();
            });
        });
        it('response.message to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/41').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {

                expect(res.body.message).to.be.string;
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/7').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an array', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/user/request/41').set('authorization', loggedInToken).send(updateRequest).end(function (err, res) {

                expect(res.body.request).to.be.an('array');
                done();
            });
        });
    });
    describe('it should get all requests for admin user', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property request', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('requests');
                done();
            });
        });
        it('response.message to be a string', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.be.string;
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an array', function (done) {
            _chai2.default.request(_index2.default).get('/api/v1/user/requests').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.requests).to.be.an('array');
                done();
            });
        });
    });
    describe('it should resolve a request', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/1/resolve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/1/resolve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/2/resolve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/3/resolve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property request', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/5/resolve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('request');
                done();
            });
        });
        it('response.message to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/6/resolve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.be.string;
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/9/resolve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an array', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/10/resolve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.request).to.be.an('array');
                done();
            });
        });
    });
    describe('it should approve a request', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/71/approve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/72/approve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/73/approve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/74/approve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property request', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/75/approve').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('request');
                done();
            });
        });
        it('response.message to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/76/approve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.be.string;
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/77/approve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an array', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/78/approve').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.request).to.be.an('array');
                done();
            });
        });
    });
    describe('it should reject a request', function () {
        this.timeout(20000);
        it('response should have a status of 200', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/30/reject').set('authorization', loggedInToken).end(function (err, res) {

                expect(res).to.have.status(200);
                done();
            });
        });
        it('response should be an object', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/29/reject').set('authorization', loggedInToken).end(function (err, res) {
                expect(res).to.be.an('object');
                done();
            });
        });
        it('response.text to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/28/reject').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.text).to.be.string;
                done();
            });
        });
        it('response to have property message', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/27/reject').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('message');
                done();
            });
        });
        it('response to have property request', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/26/reject').set('authorization', loggedInToken).end(function (err, res) {
                expect(res.body).to.have.property('request');
                done();
            });
        });
        it('response.message to be a string', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/25/reject').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.be.string;
                done();
            });
        });
        it('response.message to be operation successful', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/24/reject').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.message).to.equal("operation successful");
                done();
            });
        });
        it('request should be an array', function (done) {
            _chai2.default.request(_index2.default).put('/api/v1/requests/23/reject').set('authorization', loggedInToken).end(function (err, res) {

                expect(res.body.request).to.be.an('array');
                done();
            });
        });
    });
});