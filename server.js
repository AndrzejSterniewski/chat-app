const express = require('express');
const path = require('path');
const app = express();
const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});
const socket = require('socket.io');
const io = socket(server);

const messages = [];
const users = [];

io.on('connection', (socket) => {

    socket.on('join', (login) => {
        console.log(login + ' logged in.');
        users.push({ name: login, id: socket.id });
        socket.broadcast.emit('message', {
            author: 'Chat-Bot',
            content: `${login} has joined conversation.`
        });
        console.log(users, 'from login');
    });

    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
        const user = users.find(user => user.id === socket.id);
        if (user) {
            socket.broadcast.emit('message', {
                author: 'Chat-Bot',
                content: `${user.name} has left the conversation... :(`
            });
            users.splice(user, 1);
        };
        console.log(users, 'disconnect');
    });
});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});