import dotenv from 'dotenv';
dotenv.config()

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
// import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
const app = express()
const port = process.env.PORT || 3000
import router from './src/routes.js'
import cors from 'cors';

import http from 'http';
import { Server } from 'socket.io';
const server = http.createServer(app);
const io = new Server(server);

global.clients = {};
global.tasks = {};

// setInterval(() => {
//     console.log(global.clients);
// }, 1000);

app.use(cors())
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static('public'));

app.use('/api', router);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new_client', (data) => {
        console.log(data);
        global.clients[data] = { socket: socket, pending_tasks: [], completed_tasks: [] };
        // console.log(clients);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});