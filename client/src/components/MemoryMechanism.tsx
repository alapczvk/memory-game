import React, {useEffect, useState} from 'react';
import {Column, Grid, Row} from './App.styles';
import {useParams, useSearchParams} from 'react-router-dom';
import {useSocket} from '../contexts/SocketContext';

import ISocketContext from '../types/ISocketContext';
import IRoom, {IPoints} from '../types/IRoom';
import ICard from '../types/ICard';

import OpponentLeft from './OpponentLeft';
import WaitingForOpponentToJoin from './WaitingForOpponentToJoin';
import RoomIsFullError from './RoomIsFullError';
import Dashboard from './Dashboard';
import Card from './Card';

import {createBoard} from '../board';
import config from '../config';

type MemoryMechanismPropsType = {};

const MemoryMechanism: React.FC<MemoryMechanismPropsType> = () => {
	const [cards, setCards] = useState<ICard[]>();
	const [boardSize, setBoardSize] = useState<number | null>(null);
	const [cardTheme, setCardTheme] = useState<string>(config.game.defaultCardTheme);
	const [clickedCard, setClickedCard] = useState<undefined | ICard>(undefined);
	const [cardsClickedInThisTurn, setCardsClickedInThisTurn] = useState<number>(0);

	const [amIPlayerA, setAmIPlayerA] = useState<boolean | null>(null);
	const [isMyTurn, setIsMyTurn] = useState<boolean | null>(null);
	const [playerAPoints, setPlayerAPoints] = useState<IPoints>({points: 0, attempts: 0});
	const [playerBPoints, setPlayerBPoints] = useState<IPoints>({points: 0, attempts: 0});
	const [winner, setWinner] = useState<'a' | 'b' | 'draw' | null>(null);

	const [isRoomFull, setIsRoomFull] = useState<boolean>(false);
	const [isOpponentJoined, setIsOpponentJoined] = useState<boolean>(false);
	const [isRoomJoined, setIsRoomJoined] = useState<boolean>(false);
	const [opponentLeft, setOpponentLeft] = useState<boolean>(false);

	const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);

	const {roomId} = useParams<string>();

	const [searchParams, setSearchParams] = useSearchParams();

	const {socket, isConnected} = useSocket() as ISocketContext;

	// set board size based on URL `boardSize` param
	useEffect(() => {
		let bSize = parseInt(searchParams.get('boardSize') || '6');

		if (bSize !== 4 && bSize !== 6) {
			console.warn(`[WARNING] Board size must be 4 or 6. Continuing with board size of 6...`);

			bSize = 6;

			setSearchParams(params => {
				params.set('boardSize', '6');
				return params;
			});
		}

		setBoardSize(bSize);
	}, [searchParams, setSearchParams]);

	// set card theme based on URL `cardTheme` param
	useEffect(() => {
		let theme = searchParams.get('cardTheme') || config.game.defaultCardTheme;

		if (!config.game.cardThemes.includes(theme)) {
			console.warn(`[WARNING] Card theme incorrect! Continuing with ${config.game.defaultCardTheme}...`);

			theme = config.game.defaultCardTheme;

			setSearchParams(params => {
				params.set('cardTheme', config.game.defaultCardTheme);
				return params;
			});
		}

		setCardTheme(theme);
	}, [searchParams, setSearchParams]);

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
			setIsRoomJoined(false);
		}
	}, [isConnected, isOpponentJoined, setIsRoomJoined, winner]);

	// join-or-create-room
	useEffect(() => {
		if (isRoomJoined) return;

		if (roomId == null || boardSize == null) return;

		socket?.emit('join-or-create-room', {roomId, boardSize});
	}, [boardSize, isRoomJoined, roomId, socket]);

	// join-or-create-room-error
	useEffect(() => {
		const handler = (response: { success: boolean, msg: string, roomId: string, isRoomFull: boolean }) => {
			console.error(`[ERROR] ${response.msg}`);

			if (response.isRoomFull) {
				setIsRoomFull(true);
			} else {
				alert(response.msg);
			}
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

			if (boardSize !== 4 && response.room.boardSize === 4) {
				console.warn(`[WARNING] Game was created with board size of 4 instead of ${boardSize} provided in URL parameter`);

				setSearchParams(params => {
					params.set('boardSize', '4');
					return params;
				});
			}

			if (boardSize !== 6 && response.room.boardSize === 6) {
				console.warn(`[WARNING] Game was created with board size of 6 instead of ${boardSize} provided in URL parameter`);

				setSearchParams(params => {
					params.set('boardSize', '6');
					return params;
				});
			}

			setCards(createBoard(response.room.board, cardTheme));

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
	}, [boardSize, cardTheme, setIsRoomJoined, setSearchParams, socket]);

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
			if (winner !== null) return;

			console.log(`[INFO] ${response.msg}`);
			alert(response.msg);
			setIsOpponentJoined(false);
			setOpponentLeft(true);
			socket?.disconnect();
		};

		socket?.on('opponent-left', handler);

		return () => {
			socket?.off('opponent-left', handler);
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

				setTimeoutIds(prev => [...prev, id]);
			}

			const id = setTimeout(() => {
				setPlayerAPoints(response.playerA);
				setPlayerBPoints(response.playerB);

				setIsMyTurn(prev => !prev);

				setCardsClickedInThisTurn(0);
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

			setPlayerAPoints(response.room.playerA);
			setPlayerBPoints(response.room.playerB);

			setWinner(response.winner);
		};

		socket?.on('game-over', handler);

		return () => {
			socket?.off('game-over', handler);
		}
	}, [amIPlayerA, socket]);

	// card click handler
	const handleCardClick = (currentClickedCard: ICard) => {
		if (cardsClickedInThisTurn > 1) return;

		flipCard(currentClickedCard.id, true, false);
		setCardsClickedInThisTurn(clickedCount => clickedCount + 1);

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

	// timeout cleanup function
	useEffect(() => {
		return () => {
			for (let timeout of timeoutIds) {
				clearTimeout(timeout);
			}
		};
	}, [timeoutIds]);

	return <div>
		{isRoomFull && <RoomIsFullError/>}

		{!isOpponentJoined && !opponentLeft && !isRoomFull && <WaitingForOpponentToJoin/>}

		{opponentLeft && <OpponentLeft/>}

		{isOpponentJoined && !opponentLeft &&
          <Row>
              <Column $size={30}>
                  <Dashboard
                      winner={winner}
                      isMyTurn={isMyTurn}
                      playerAPoints={playerAPoints}
                      playerBPoints={playerBPoints}
                      amIPlayerA={amIPlayerA}
                  />
              </Column>

              <Column>
					  {boardSize &&
                     <Grid $boardSize={boardSize}>
								{cards?.map((card) => <Card
									key={card.id}
									disabled={!isMyTurn}
									card={card}
									callback={handleCardClick}
								/>)}
                     </Grid>
					  }
              </Column>
          </Row>
		}
	</div>;
};

export default MemoryMechanism;
