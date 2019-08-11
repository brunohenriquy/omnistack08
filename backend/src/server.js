const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const httpServer = express();

const server = require('http').Server(httpServer);
const io = require('socket.io')(server);

// io.on('connection', socket => {
//     console.log('Nova conexão', socket.id)

//     socket.on('hello', message => {
//         console.log(message)
//     })

//     setTimeout(() => {
//         socket.emit('world', {
//             message: 'OmniStack'
//         })
//     }, 5000);
// });

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    connectedUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://bh:bh@cluster0-adkfc.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

httpServer.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

httpServer.use(cors());
httpServer.use(express.json());
httpServer.use(routes);

server.listen(3333);