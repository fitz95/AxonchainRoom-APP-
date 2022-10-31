const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors()); //  cors middleware
const CHAT_BOT = 'ChatBot';
// Add this
let chatRoom = ''; //  Variable to store  Room E.g. javascript, node,...
let allUsers = []; //  Vraible to store All users in current chat room

const server = http.createServer(app);
//Created an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  //Listening  for when the client connects via socket.io-client
  io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    // We can write our socket event listeners in here...
    socket.on('join_room', (data) => {
        const { username, room } = data; // Data sent from client when join_room event emitted
        socket.join(room); // Join the user to a socket room

        let __createdtime__ = Date.now(); // Current timestamp
        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit('receive_message', {
          message: `${username} has joined the chat room`,
          username: CHAT_BOT,
          __createdtime__,
        });
        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
          });
      });
  });




  
server.listen(4000, () => 'Server is running on port 4000')