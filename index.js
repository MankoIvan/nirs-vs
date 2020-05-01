const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('image', (image) => {
    console.log(image)
})
io.on('connection', (socket) => {
  console.log(`socket connected to ${socket.handshake.headers.origin}`);
    socket.on('image', (data) => {
    });
});
const transferIO = require('socket.io-client');

const transferSocket = transferIO.connect('http...')



server.listen(3000);
