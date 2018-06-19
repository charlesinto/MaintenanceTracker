import express from 'express';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import route from './routes/index'
import userRoute from './routes/Uers'
import loginSignUp from './routes/loginSignup'
require('dotenv').config();

const apiVersion = express.Router();
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', route);
//login and sign up route
app.use('/api/v1/auth', loginSignUp);
//user routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/user', userRoute);
//create server;
let port = process.env.PORT || 5000;
let server = http.createServer(app)
let io = socket().listen(server);
io.on('connection', (socket)=>{
    console.log(`user connected, id: ${socket.id}`);
})

server.listen(port,()=>{console.log(`server is listening on port ${port}`)});

export default server;