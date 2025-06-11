// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(4000, () => {
  console.log('Servidor corriendo en http://localhost:4000');
});
