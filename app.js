import express from 'express';
import {createServer} from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import { Server } from 'socket.io';

// import dotenv
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);

const PORT =  process.env.PORT || 3000;

// socket.io server
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});



const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req ,res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen( PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    }
);