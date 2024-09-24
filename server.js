import express from 'express';
import {createServer} from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

// socket.io server
const io = new Server(server , {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});



const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req ,res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
    }
);