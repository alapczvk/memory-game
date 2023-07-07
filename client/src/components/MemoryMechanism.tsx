import React, {useEffect, useState} from "react";
import Card from "./Card";
import {createBoard} from "../setup";
import {Grid} from "./App.styles";
import Timer from "./Timer";
import {useParams, useSearchParams} from 'react-router-dom';
import {useSocket} from '../contexts/SocketContext';
import ISocketContext from '../types/ISocketContext';
import IRoom, {IPoints} from '../types/IRoom';
import ICard from '../types/ICard';

type MemoryMechanismProps = {};

const MemoryMechanism: React.FC<MemoryMechanismProps> = () => {
	const [cards, setCards] = useState<ICard[]>();
	const [boardSize, setBoardSize] = useState<number | null>(null);
	const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
	const [winner, setWinner] = useState<'a' | 'b' | 'draw' | null>(null);
	const [clickedCard, setClickedCard] = useState<undefined | ICard>(undefined);
	const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);
	const [isMyTurn, setIsMyTurn] = useState<boolean | null>(null);
	const [playerAPoints, setPlayerAPoints] = useState<IPoints>({points: 0, attempts: 0});
	const [playerBPoints, setPlayerBPoints] = useState<IPoints>({points: 0, attempts: 0});
	const [amIPlayerA, setAmIPlayerA] = useState<boolean | null>(null);
	const [isOpponentJoined, setIsOpponentJoined] = useState<boolean>(false);
	const [opponentLeft, setOpponentLeft] = useState<boolean>(false);

	const {id: roomId} = useParams<string>();

	const [searchParams, setSearchParams] = useSearchParams();

	const {socket, isConnected, isRoomJoined, setIsRoomJoined} = useSocket() as ISocketContext;

	// difficulty level and board size (based on URL `level` param)
	useEffect(() => {
		const level = searchParams.get('level') || 'easy';

		setSelectedLevel(level);
		setBoardSize(level === 'easy' ? 4 : 6);
	}, [searchParams]);

	// function to flip card selected by its index
	const flipCard = (cardId: number, flipped: boolean, clickable: boolean) => {
		setCards(prev =>
			prev?.map((card, index) =>
				index === cardId ? {...card, flipped, clickable} : card
			)
		);
	};

	// socket.io connect/disconnect
	useEffect(() => {
		socket?.connect();

		return () => {
			socket?.disconnect();
		};
	}, [socket]);

	// connection error
	useEffect(() => {
		if (!isConnected && isOpponentJoined) {
			winner == null && alert('No connection. Exiting...');
			setIsOpponentJoined(false);
		}
	}, [isConnected, isOpponentJoined, winner]);

	// join-or-create-room
	useEffect(() => {
		if (isRoomJoined) return;

		if (roomId == null || boardSize == null) return;

		socket?.emit('join-or-create-room', {roomId, boardSize});
	}, [boardSize, isRoomJoined, roomId, socket]);

	// join-or-create-room-error
	useEffect(() => {
		const handler = (response: { success: boolean, msg: string, roomId: string }) => {
			alert(response.msg);
			console.error(`[ERROR] ${response.msg}`);
		};
		socket?.on('join-or-create-room-error', handler);

		return () => {
			socket?.off('join-or-create-room-error', handler);
		}
	}, [socket]);

	// room-joined (or created)
	useEffect(() => {
		const handler = (response: { success: boolean, msg: string, room: IRoom }) => {
			console.log(`[GAME] ${response.msg}`);

			setIsRoomJoined(true);

			if (selectedLevel === 'medium' && response.room.boardSize === 4) {
				setSearchParams(params => {
					params.set('level', 'easy');
					return params;
				});
			}

			if (selectedLevel === 'easy' && response.room.boardSize === 6) {
				setSearchParams(params => {
					params.set('level', 'medium');
					return params;
				});
			}

			setCards(createBoard(response.room.board));

			setIsMyTurn((response.room.turn === 'a' &&
					socket?.id === response.room.createdBySocketId) ||
				(response.room.turn === 'b' &&
					socket?.id === response.room.joinedBySocketId));

			setPlayerAPoints(response.room.playerA);
			setPlayerBPoints(response.room.playerB);
			setAmIPlayerA(socket?.id === response.room.createdBySocketId);
			if (response.room.joinedBySocketId != null) {
				setIsOpponentJoined(true);
				setOpponentLeft(false);
			}
		};

		socket?.on('room-joined', handler);

		return () => {
			socket?.off('room-joined', handler);
		}
	}, [selectedLevel, setIsRoomJoined, setSearchParams, socket]);

	// player-joined
	useEffect(() => {
		const handler = (joinedBySocketId: string) => {
			console.log(`[GAME] Game joined by ${joinedBySocketId}`);
			setIsOpponentJoined(true);
			setOpponentLeft(false);
		};

		socket?.on('player-joined', handler);

		return () => {
			socket?.off('player-joined', handler);
		}
	}, [socket]);

	// opponent-left
	useEffect(() => {
		const handler = (response: {
			success: boolean,
			msg: string,
			playerA: IPoints,
			playerB: IPoints
		}) => {
			console.log(`[INFO] ${response.msg}`);
			winner == null && alert(response.msg);
			setIsOpponentJoined(false);
			setOpponentLeft(true);
			socket?.disconnect();
		};

		socket?.on('opponent-left', handler);

		return () => {
			socket?.off('opponent-left', handler);
			socket?.disconnect();
		}
	}, [opponentLeft, socket, winner]);

	// opponent-single-guess-attempt
	useEffect(() => {
		const handler = (cardIndex: number) => {
			console.log(`[GAME] Opponent guesses: ${cardIndex}`);
			flipCard(cardIndex, true, false);
		};
		socket?.on('opponent-single-guess-attempt', handler);

		return () => {
			socket?.off('opponent-single-guess-attempt', handler);
		}
	}, [socket]);

	// opponent-guess-attempt
	useEffect(() => {
		const handler = (response: {
			success: boolean,
			msg: string,
			correct: boolean,
			chosenCards: number[],
			playerA: IPoints,
			playerB: IPoints,
			nextTurn: 'a' | 'b'
		}) => {
			console.log(`[GAME] Opponent guessed: ${response.msg}`);

			if (response.correct) {
				flipCard(response.chosenCards[0], true, false);
				flipCard(response.chosenCards[1], true, false);
			} else {
				const id = setTimeout(() => {
					flipCard(response.chosenCards[0], false, true);
					flipCard(response.chosenCards[1], false, true);
				}, 750);

				setTimeoutIds([...timeoutIds, id]);
			}

			const id = setTimeout(() => {
				setPlayerAPoints(response.playerA);
				setPlayerBPoints(response.playerB);
				setIsMyTurn(prev => !prev);
			}, 750);

			setTimeoutIds(prev => [...prev, id]);
		};
		socket?.on('opponent-guess-attempt', handler);

		return () => {
			socket?.off('opponent-guess-attempt', handler);
		}
	}, [socket]);

	// game-over
	useEffect(() => {
		const handler = (response: {
			success: boolean,
			msg: string
			winner: 'a' | 'b' | 'draw',
			room: IRoom
		}) => {
			console.log(`[GAME] ${response.msg}`);
			setIsMyTurn(false); // there is no one's turn!

			const id = setTimeout(() => {
				setPlayerAPoints(response.room.playerA);
				setPlayerBPoints(response.room.playerB);

				setWinner(response.winner);

				if (response.winner === 'draw') {
					return alert('It\'s a draw!');
				}

				alert(
					(amIPlayerA && response.winner === 'a') ||
					(!amIPlayerA && response.winner === 'b')
						? 'You won!' : 'Your opponent won!');
			}, 1200);

			setTimeoutIds(prev => [...prev, id]);
		};

		socket?.on('game-over', handler);

		return () => {
			socket?.off('game-over', handler);
		}
	}, [amIPlayerA, socket]);

	// card click handler
	const handleCardClick = (currentClickedCard: ICard) => {
		flipCard(currentClickedCard.id, true, false);

		socket?.emit('single-guess-attempt', {
			cardIndex: currentClickedCard.id
		});

		// If this is the first card that is flipped
		// just keep it flipped
		if (clickedCard == null) {
			setClickedCard({...currentClickedCard});
			return;
		}

		if (currentClickedCard.id !== clickedCard.id) {
			const isCorrect = currentClickedCard.boardIdx === clickedCard.boardIdx;

			socket?.emit('guess-attempt', {
				cardIndexes: [currentClickedCard.id, clickedCard.id],
				correct: isCorrect
			});

			if (isCorrect) {
				flipCard(currentClickedCard.id, true, false);
				flipCard(clickedCard.id, true, false);
			} else {
				const id = setTimeout(() => {
					flipCard(currentClickedCard.id, false, true);
					flipCard(clickedCard.id, false, true);
				}, 750);
				setTimeoutIds([...timeoutIds, id]);
			}

			const id = setTimeout(() => {
				amIPlayerA ?
					setPlayerAPoints({
						points: isCorrect ? playerAPoints?.points + 1 : playerAPoints?.points,
						attempts: playerAPoints?.attempts + 1
					}) :
					setPlayerBPoints({
						points: isCorrect ? playerBPoints?.points + 1 : playerBPoints?.points,
						attempts: playerBPoints?.attempts + 1
					});
				setIsMyTurn(prev => !prev);
			}, 750);

			setTimeoutIds([...timeoutIds, id]);

		}

		setClickedCard(undefined);
	};

	// change current turn
	useEffect(() => {
		cards?.map((card) => {
			if (isMyTurn === null) return card;

			// if card is not flipped (not guessed yet)
			if (!card.flipped) {
				card.clickable = true;
			}

			return card;
		});
	}, [cards, isMyTurn]);

	// cleanup function
	useEffect(() => {
		return () => {
			for (let timeout of timeoutIds) {
				clearTimeout(timeout);
			}
		};
	}, [timeoutIds]);

	return <>
		{isOpponentJoined ?
			<div>
				<Timer gameWinner={winner}/>

				{winner != null && winner === 'draw' && <h2>It's a draw!</h2>}
				{winner != null &&
					(((winner === 'a' && amIPlayerA) || (!amIPlayerA && winner === 'b')) ?
						<h2>You won!</h2> :
						<h2>Your opponent won!</h2>)
				}

				{isMyTurn != null && winner == null &&
                <h2>{isMyTurn ? 'It\'s your turn!' : 'It\'s your opponent\'s turn!'}</h2>
				}

				{playerAPoints !== null && playerBPoints !== null &&
                <>
                    <div>You: {JSON.stringify(amIPlayerA ? playerAPoints : playerBPoints)}</div>
                    <div>Opponent: {JSON.stringify(!amIPlayerA ? playerAPoints : playerBPoints)}</div>
                </>
				}

				<Grid $boardSize={selectedLevel === "easy" ? 4 : 6}>
					{cards?.map((card) => (
						<Card key={card.id} disabled={!isMyTurn} card={card} callback={handleCardClick}/>
					))}
				</Grid>
			</div> :
			<div>{opponentLeft ? 'Opponent has left - refresh page to start game once again' : 'Waiting for opponent to join...'}</div>}
	</>;
};

export default MemoryMechanism;
