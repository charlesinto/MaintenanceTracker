import express from 'express';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
require('dotenv').config();

const apiVersion = express.Router();
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//create server;
let port = process.env.PORT || 5000;
let server = http.createServer(app)
let io = socket().listen(server);
io.on('connection', (socket)=>{
    console.log(`user connected, id: ${socket.id}`);
})

server.listen(port,()=>{console.log(`server is listening on port ${port}`)});

export default app;