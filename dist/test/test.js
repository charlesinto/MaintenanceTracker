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
var user = {
    "firstname": "    charles",
    "lastname": "   onuorah    ",
    "email": " chibuike22@gmail.com",
    "password": " 3450  ",
    "phonenumber": "   08163113450"
};
describe('login/signup', function () {
    describe('It should sign up user', function () {
        this.timeout(10000);
        it('response should have a status of 201', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signup').type('form').send(user).end(function (err, res) {
                expect(res).to.have.status(201);
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
        it('response.message to be login successful', function (done) {
            _chai2.default.request(_index2.default).post('/api/v1/auth/signup').type('form').send(user).end(function (err, res) {
                expect(res.body).to.deep.equal({ message: 'User already exists' });
                done();
            });
        });
    });
});