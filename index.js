/* eslint-disable prettier/prettier */
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./db/connectDB');
const routes = require('./routes/index');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = require('express')();

const port = process.env.PORT || 5000;

//Nexmo Setup
const Nexmo = require('nexmo');
const nexmo = new Nexmo(
    {
        apiKey: `${process.env.API_KEY}`,
        apiSecret: `${process.env.API_SECRET}`,
    },
    { debug: true },
);

// middleware
const errorMiddleware = require('./middleware/error');
// const {socketServer} = require('./server/socketServer');

app.use(cors());
app.use(express.json());

// connect with mongoDb function
connectDb();

// Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    //   socket.on('joinUser', id=>{
    //     console.log({id}, 'form id');
    // })
    // socketServer(socket);
});

app.post('/smsIssue', async (req, res) => {
    const { number, msg, severity } = req.body;

    if (severity === 'critical') {
        nexmo.message.sendSms(
            'Vonage APIs',
            number,
            msg,
            { type: 'unicode' },
            (err, responseData) => {
                if (err) {
                    console.log(err);
                } else {
                    const { messages } = responseData;
                    const {
                        ['message-id']: id,
                        ['to']: number,
                        ['error-text']: error,
                    } = messages[0];
                    console.dir(responseData);
                    // Get data from response
                    const data = {
                        id,
                        number,
                        error,
                    };

                    // Emit to the client
                    io.emit('smsStatus', data);
                }
            },
        );
    }
});

// Create peer server
ExpressPeerServer(http, { path: '/' });

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

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
