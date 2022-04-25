const { socket, socketServer, port } = require('../server/socketServer');
const io = require('socket.io')(socketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

socket.get('/', (req, res) => {
    res.send('Running');
});

const test = io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    console.log(socket.id);
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

module.exports = test;
