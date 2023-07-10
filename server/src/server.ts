import express from 'express';
import http from 'http';
import config from 'config';
import {logInfo} from './utils/logger';
import path from 'path';
import IRoom from './types/IRoom';
import {
	isRoomJoined,
	isUserACreatorOrJoinerOfRoom,
	roomExists,
} from './utils/rooms';
import requestLogger from './middleware/requestLogger';
import IRoomObjectList from './types/IRoomObjectList';
import {getRandomArray, getRandomBinaryDigit, shuffleArray} from './utils';

const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
	cors: {
		origin: config.get<string[]>('ORIGIN')
	}
});

const rooms: IRoomObjectList = {};
const logGameEvents = true;

io.on('connection', socket => {
	logInfo(`[socket] ${socket.id} connected to server`);

	socket.on('disconnect', () => {
		logInfo(`[socket] ${socket.id} disconnected from server`);

		// find left room and destroy it
		let leftRoom: IRoom;

		for (const key in rooms) {
			if (!rooms.hasOwnProperty(key)) continue;

			const room = rooms[key];

			if (room?.joinedBySocketId === socket.id) {
				leftRoom = room;
				break;
			}
		}

		if (leftRoom == null) return;

		socket.to(leftRoom.id).emit('opponent-left', {
			success: false,
			msg: 'Your opponent has left!',
			playerA: leftRoom.playerA,
			playerB: leftRoom.playerB
		});


		if (io.sockets.sockets[leftRoom?.joinedBySocketId]) {
			io.sockets.sockets[leftRoom?.joinedBySocketId].disconnect();
		}

		// clear room
		rooms[leftRoom.id] = undefined;
		logGameEvents && logInfo(`[GAME] Room with ID=${leftRoom.id} has been destroyed`);

		return;
	});

	socket.emit('greeting-from-server', {msg: 'Hello Client'});

	socket.on('join-or-create-room', (data) => {
		if (data.roomId == null || data.boardSize == null) {
			logGameEvents && logInfo('[GAME] Invalid request params');
			socket.emit('join-or-create-room-error', {
				success: false,
				msg: 'Invalid request params!',
				isRoomFull: false
			});
			return;
		}

		socket.on('disconnect', () => {
			if (!isUserACreatorOrJoinerOfRoom(socket.id, data.roomId, rooms)) {
				return;
			}

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

		socket.on('single-guess-attempt', (guessData) => {
			const game = rooms[data.roomId];

			if (guessData.cardIndex == null ||
				guessData.cardIndexes > game.board.length - 1) {

				logGameEvents && logInfo('[GAME] Invalid request params');

				socket.emit('single-guess-attempt-error', {
					success: false,
					msg: 'Invalid request params!'
				});
				return;
			}

			socket.to(data.roomId).emit('opponent-single-guess-attempt', guessData.cardIndex);
		});

		socket.on('guess-attempt', (guessData) => {
			logGameEvents && logInfo('[GAME] Guess attempt');

			const game = rooms[data.roomId];
			if (guessData.cardIndexes == null ||
				guessData.cardIndexes.length !== 2 ||
				guessData.cardIndexes[0] > game.board.length - 1 ||
				guessData.cardIndexes[1] > game.board.length - 1 ||
				guessData.correct == null) {

				logGameEvents && logInfo('[GAME] Invalid request params');

				socket.emit('guess-correct-error', {
					success: false,
					msg: 'Invalid request params!'
				});
				return;
			}

			if (guessData.correct) {
				if (game.turn === 'a') {
					rooms[data.roomId].playerA.points += 1;
				} else {
					rooms[data.roomId].playerB.points += 1;
				}

				rooms[data.roomId].guessedCardsIndexes.push(guessData.cardIndexes[0], guessData.cardIndexes[1]);
			}

			if (game.turn === 'a') {
				rooms[data.roomId].playerA.attempts += 1;
			} else {
				rooms[data.roomId].playerB.attempts += 1;
			}

			const nextTurn = rooms[data.roomId].turn === 'a' ? 'b' : 'a';
			rooms[data.roomId].turn = nextTurn;

			socket.to(data.roomId).emit('opponent-guess-attempt', {
				success: true,
				msg: guessData.correct ? 'Correct!' : 'Incorrect!',
				correct: guessData.correct,
				chosenCards: guessData.cardIndexes,
				playerA: rooms[data.roomId].playerA,
				playerB: rooms[data.roomId].playerB,
				nextTurn
			});

			// game over
			if (rooms[data.roomId].guessedCardsIndexes.length === rooms[data.roomId].board.length) {
				let winner;
				if (game.playerA.points === game.playerB.points) {
					winner = 'draw';
				} else if (game.playerA.points > game.playerB.points) {
					winner = 'a'
				} else {
					winner = 'b';
				}

				logGameEvents && logInfo(`[GAME] ${winner === 'draw' ? 'Game over: DRAW' : 'Game over: ' + winner.toUpperCase() + ' wins!'}`);

				io.sockets.in(data.roomId).emit('game-over', {
					success: true,
					msg: winner === 'draw' ? 'Game over: DRAW' : 'Game over: player ' + winner.toUpperCase() + ' wins!',
					winner,
					room: game
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
					isRoomFull: true
				});
				logGameEvents && logInfo(`[GAME] Room with ID=${data.roomId} is full`);
				return;
			}

			// join room
			socket.join(data.roomId);

			// set room as joined by setting up joinedBySocketId with playerB's socket.id
			rooms[data.roomId].joinedBySocketId = socket.id;

			socket.emit('room-joined', {
				success: true,
				msg: `Room has been joined`,
				room: rooms[data.roomId]
			});

			logGameEvents && logInfo(`[GAME] Room with ID=${data.roomId} has been joined by ${socket.id}`);

			socket.to(data.roomId).emit('player-joined', socket.id);

			io.sockets.in(data.roomId).emit('start-game', {
				success: true,
				msg: 'Starting...',
				turn: rooms[data.roomId].turn
			});
		} else {
			// room does not exist => create a new one
			socket.join(data.roomId);

			// prepare board
			const numberOfCards = data.boardSize * data.boardSize;
			const randomArray = getRandomArray(18, numberOfCards / 2);

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

			logGameEvents && logInfo(`[GAME] Room with ID=${data.roomId} has been created by ${socket.id}`);

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
