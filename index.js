const express = require("express");
const {v4: uuidv4} = require('uuid');
const http = require('http');
const app = express(); 
const server = http.createServer(app);
const io = require('socket.io')(server);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomID: req.params.room})
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomID) => {
        socket.join(roomID);
        socket.to(roomID).emit('user-connected');
    })
})

server.listen(8000, () => {
    console.log("Server is running on port 8000");
})