const socket = require('express')();
const socketServer = require('http').createServer(socket);
const cors = require('cors');
const port = process.env.PORT || 5000;
const io = require('socket.io')(socketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

socket.get('/', (req, res) => {
    res.send('Running');
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });
});

socketServer.listen(port, () => console.log(`Server is running on port ${port}`));
