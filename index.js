/* eslint-disable prettier/prettier */
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./db/connectDB');
const routes = require('./routes/index');

const app = require('express')();

const port = process.env.PORT || 5000;

// middleware
const errorMiddleware = require('./middleware/error');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect with mongoDb function
connectDb();

// import routes
app.use(routes);

app.get('/hi', (req, res) => {
    res.send('hi');
    console.log('Hi');
});

app.get('/', (req, res) => {
    res.send('hello');
});

app.use(errorMiddleware);

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.on('connection', (socket) => {
    // console.log('Connedted to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
        // socket.emit("me", userData._id);
    });

    socket.emit('me', socket.id);
    // console.log(socket.id);
    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('callUser', { signal: signalData, from, name });
    });

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

    // Joining Chat room
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User joined Room:' + room);
    });

    // Typing indicator
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    // Sending new Message
    socket.on('new message', (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        console.log(newMessageRecieved);

        if (!chat.users) return console.log('Chat.users not defined');

        chat.users.forEach((user) => {
            if (user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        });
    });
});
