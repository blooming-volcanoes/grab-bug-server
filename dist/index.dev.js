'use strict';

/* eslint-disable prettier/prettier */
var express = require('express');

var http = require('http');

var port = process.env.PORT || 5000;

var socketio = require('socket.io');

var errorMiddleware = require('./middleware/error');

var cors = require('cors');

require('dotenv').config(); //DB Connection

var connectDb = require('./db/connectDB'); // connect with mongoDb function

connectDb(); //Routes

var routes = require('./routes/index'); //App Initialization

var app = express();
var httpserver = http.createServer(app); //Socket

var io = socketio(httpserver, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
}); // middleware

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use(routes); //App Listening

app.get('/', function (req, res) {
    res.send('hello');
}); //Http`S`erver

httpserver.listen(port, function () {
    console.log('listening on *', port);
});
exports.httpserver = httpserver;
