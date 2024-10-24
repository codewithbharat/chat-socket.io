import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

// socket.io server with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins, you can restrict this to specific domains
        methods: ["GET", "POST"]
    }
});

let roomCounter = 0;
const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    // Find a room with less than 2 users
    let room = Object.keys(rooms).find(room => rooms[room].length < 2);

    // If no such room exists, create a new one
    if (!room) {
        room = `room-${roomCounter++}`;
        rooms[room] = [];
    }

    // Add the user to the room
    rooms[room].push(socket.id);
    socket.join(room);
    console.log(`User joined ${room}`);

    // Notify the user if they are waiting for another user to join
    if (rooms[room].length === 1) {
        socket.emit('waiting', 'Waiting for another user to join...');
    } else {
        io.to(room).emit('start chat', 'You can start chatting now!');
    }

    socket.on('chat message', (msg) => {
        socket.to(room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        rooms[room] = rooms[room].filter(id => id !== socket.id);
        if (rooms[room].length === 0) {
            delete rooms[room];
        }
    });
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});