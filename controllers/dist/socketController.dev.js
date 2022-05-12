'use strict';

var _require = require('../server/socketServer'),
    socket = _require.socket,
    socketServer = _require.socketServer,
    port = _require.port;

var io = require('socket.io')(socketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

socket.get('/', function (req, res) {
    res.send('Running');
});
var test = io.on('connection', function (socket) {
    socket.emit('me', socket.id);
    console.log(socket.id);
    socket.on('disconnect', function () {
        socket.broadcast.emit('callEnded');
    });
    socket.on('callUser', function (_ref) {
        var userToCall = _ref.userToCall,
            signalData = _ref.signalData,
            from = _ref.from,
            name = _ref.name;
        io.to(userToCall).emit('callUser', {
            signal: signalData,
            from: from,
            name: name,
        });
    });
    socket.on('answerCall', function (data) {
        io.to(data.to).emit('callAccepted', data.signal);
    });
});
module.exports = test;
