'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _Uers = require('./routes/Uers');

var _Uers2 = _interopRequireDefault(_Uers);

var _loginSignup = require('./routes/loginSignup');

var _loginSignup2 = _interopRequireDefault(_loginSignup);

var _Admin = require('./routes/Admin');

var _Admin2 = _interopRequireDefault(_Admin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var apiVersion = _express2.default.Router();
var app = (0, _express2.default)();
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));
app.use(_express2.default.static('public'));

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use('/', _index2.default);
//login and sign up route
app.use('/api/v1/auth', _loginSignup2.default);
//user routes
app.use('/api/v1/users', _Uers2.default);
app.use('/api/v1/user', _Uers2.default);

//admin routes 
app.use('/api/v1/requests', _Admin2.default);
//create server;
var port = process.env.PORT || 5000;
var server = _http2.default.createServer(app);
var io = (0, _socket2.default)().listen(server);
io.on('connection', function (socket) {
    console.log('user connected, id: ' + socket.id);
    //when update of status is made
    socket.on('updateStatus', function (msg) {
        socket.broadcast.emit('updateStatus', msg);
    });
});

server.listen(port, function () {
    console.log('server is listening on port ' + port);
});

exports.default = server;