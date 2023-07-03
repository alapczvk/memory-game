import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from 'config';
import trimmer from './middleware/trimmer';
import router from './routes/main.router';
import requestLogger from './middleware/requestLogger';
import {logError, logInfo} from "./utils/logger";
import {SUCCESS} from './helpers/responses/messages';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import {writeFile} from 'fs';

const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: config.get<string[]>('ORIGIN')
    }
});

app.use(cors({
    origin: config.get<string[]>('ORIGIN'),
    credentials: true
}));

//DO WERYFIKACJI FILIPA!!!!!!!!1
// app.get('/game', (req, res) => {
//     const level = req.query.level;
//     res.redirect(`/game/${uuidv4()}`);
// });
// app.get('/game/:level', (req, res) => {
//     const level = req.params.level;
//     res.send("game");
// });
app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);
app.use(trimmer);
app.use('/api', router);



io.on('connection', socket => {
    logInfo(`[socket] ${socket.id} connected to server`);

    socket.on('disconnect', () => {
        logInfo(`[socket] ${socket.id} disconnected from server`);
    });
    socket.on('olinusia',data=>{
        console.log(data);
    })
    socket.emit('greeting-from-server', {msg: 'Hello Client'});
});

// TODO: remove in production
app.get('/test', async (req, res) => {
    return SUCCESS(res, {
        testing: true
    })
})

/* SERVE STATIC FILES (FRONTEND) */
app.use('/', express.static(config.get<string>("STATIC_FILES_DIR")));
app.get('*', (req, res) => res.sendFile(path.resolve(config.get<string>("STATIC_FILES_DIR"), 'index.html')))

export default httpServer;