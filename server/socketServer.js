const socket = require('express')();
const socketServer = require('http').createServer(socket);
const cors = require('cors');

// socketServer.use(cors())
const port = process.env.PORT || 8000;

module.exports = { socket, socketServer, port };
