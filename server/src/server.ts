import express from 'express';
import http from 'http';
import config from 'config';
import { logInfo} from './utils/logger';
import path from 'path';
import IRoom from './types/IRoom';
import {
	getRandomArray,
	getRandomBinaryDigit, isGuessCorrect,
	isRoomJoined,
	roomExists,
	shuffleArray
} from './utils/rooms';
import requestLogger from './middleware/requestLogger';

const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
	cors: {
		origin: config.get<string[]>('ORIGIN')
	}
});

const rooms: { [key: string]: IRoom; } = {};
const logGameEvents = true;

io.on('connection', socket => {
	logInfo(`[socket] ${socket.id} connected to server`);

	socket.on('disconnect', () => {
		logInfo(`[socket] ${socket.id} disconnected from server`);
	});

	socket.emit('greeting-from-server', {msg: 'Hello Client'});

	socket.on('join-or-create-room', (data) => {
		if (data.roomId == null || data.boardSize == null) {
			logGameEvents && logInfo('[GAME] Invalid request params');
			socket.emit('join-or-create-room-error', {
				success: false,
				msg: 'Invalid request params!'
			});
			return;
		}

		socket.on('disconnect', () => {
			logGameEvents && logInfo(`[GAME] Player with socket.id=${socket.id} disconnected from room with ID=${data.roomId}`);
			socket.to(data.roomId).emit('opponent-left', {
				success: false,
				msg: 'Your opponent has left!',
				playerA: rooms[data.roomId]?.playerA,
				playerB: rooms[data.roomId]?.playerB
			});

			// clear room
			rooms[data.roomId] = undefined;
			logGameEvents && logInfo(`[GAME] Room with ID=${data.roomId} has been destroyed`);

			return;
		});

		socket.on('guess-attempt', (guessData) => {
			const game = rooms[data.roomId];

			if (guessData.cardIdexes == null || guessData.cardIdexes.length !== 2 ||
				guessData.cardIdexes[0] > game.board.length - 1 ||
				guessData.cardIdexes[1] > game.board.length - 1) {

				logGameEvents && logInfo('[GAME] Invalid request params');

				socket.emit('guess-attempt-error', {
					success: false,
					msg: 'Invalid request params!'
				});
				return;
			}

			socket.to(data.roomId).emit('opponent-guess-attempt', guessData.cardIdexes);

			if (isGuessCorrect(guessData.cardIdexes, game.board)) {
				logGameEvents && logInfo('[GAME] Correct guess');

				if (rooms[data.roomId].turn === 'a') {
					rooms[data.roomId].playerA.points += 1;
					rooms[data.roomId].playerA.attempts += 1;
				} else {
					rooms[data.roomId].playerB.points += 1;
					rooms[data.roomId].playerB.attempts += 1;
				}

				const nextTurn = rooms[data.roomId].turn === 'a' ? 'b' : 'a';
				rooms[data.roomId].turn = nextTurn;

				io.sockets.in(data.roomId).emit('guess-correct', {
					success: true,
					msg: 'Correct!',
					nextTurn,
					playerA: rooms[data.roomId].playerA,
					playerB: rooms[data.roomId].playerB
				});

				rooms[data.roomId].guessedCardsIndexes.push(guessData.cardIdexes[0], guessData.cardIdexes[1]);

				// game over
				if (rooms[data.roomId].guessedCardsIndexes.length === rooms[data.roomId].board.length) {
					const game = rooms[data.roomId];

					let winner;
					if (game.playerA === game.playerB) {
						winner = 'draw';
					} else if (game.playerA > game.playerB) {
						winner = 'a'
					} else {
						winner = 'b';
					}

					logGameEvents && logInfo(`[GAME] ${winner === 'draw' ? 'Game over: DRAW' : 'Game over: ' + winner.toUpperCase() + ' wins!'}`);

					io.sockets.in(data.roomId).emit('game-over', {
						success: true,
						msg: winner === 'draw' ? 'Game over: DRAW' : 'Game over: ' + winner.toUpperCase() + ' wins!',
						winner,
						room: game
					});
				}
			} else {
				logGameEvents && logInfo('[GAME] Incorrect guess');

				if (rooms[data.roomId].turn === 'a') {
					rooms[data.roomId].playerA.attempts += 1;
				} else {
					rooms[data.roomId].playerB.attempts += 1;
				}

				const nextTurn = rooms[data.roomId].turn === 'a' ? 'b' : 'a';
				rooms[data.roomId].turn = nextTurn;

				io.sockets.in(data.roomId).emit('guess-incorrect', {
					success: true,
					msg: 'Incorrect!',
					nextTurn,
					playerA: rooms[data.roomId].playerA,
					playerB: rooms[data.roomId].playerB
				});
			}
		});

		if (roomExists(data.roomId, rooms)) {
			// room exists
			if (isRoomJoined(data.roomId, rooms)) {
				// room is full
				socket.emit('join-or-create-room-error', {
					success: false,
					msg: 'This room is full!',
					roomId: data.roomId,
				});
				logGameEvents && logInfo(`[GAME] Room with ID=${data.roomId} is full`);
				return;
			}

			// console.table(rooms)

			// join room
			socket.join(data.roomId);

			// set room as joined by setting up joinedBySocketId with playerB's socket.id
			rooms[data.roomId].joinedBySocketId = socket.id;

			socket.emit('room-joined', {
				success: true,
				msg: `Room has been joined`,
				room: rooms[data.roomId]
			});

			logGameEvents && logInfo(`[GAME] Room with ID=${data.roomId} has been joined`);

			socket.to(data.roomId).emit('player-joined', socket.id);

			io.sockets.in(data.roomId).emit('start-game', {
				success: true,
				msg: 'Starting...',
				turn: rooms[data.roomId].turn
			});
		} else {
			// room does not exist => create a new one
			socket.join(data.roomId);

			// prepare cards
			const numberOfCards = data.boardSize * data.boardSize;
			const randomArray = getRandomArray(numberOfCards / 2);

			const newRoom: IRoom = {
				id: data.roomId,
				createdBySocketId: socket.id,
				joinedBySocketId: null,
				boardSize: data.boardSize,
				board: shuffleArray([...randomArray, ...randomArray]),
				guessedCardsIndexes: [],
				playerA: {points: 0, attempts: 0},
				playerB: {points: 0, attempts: 0},
				turn: getRandomBinaryDigit() === 1 ? 'a' : 'b',
				createdAt: new Date()
			};

			rooms[data.roomId] = newRoom;

			logGameEvents && logInfo(`[GAME] Room with ID=${data.roomId} has been created`);

			socket.emit('room-joined', {
				success: true,
				msg: `Room has been created`,
				room: newRoom
			});
		}
	});
});

/* HTTP request logger */
app.use(requestLogger);

/* SERVE STATIC FILES (FRONTEND) */
app.use('/', express.static(config.get<string>('STATIC_FILES_DIR')));
app.get('*', (req, res) => res.sendFile(path.resolve(config.get<string>('STATIC_FILES_DIR'), 'index.html')))

export default httpServer;
