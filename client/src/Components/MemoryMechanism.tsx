import React, {useEffect, useState} from "react";
import Card from "./Card";
import {cardArray, CardType, createBoard4x4} from "../setup";
import {Grid} from "./App.styles";
import Timer from "./Timer";
import {useParams, useSearchParams} from 'react-router-dom';
import {useSocket} from '../contexts/SocketContext';
import ISocketContext from '../types/ISocketContext';
import IRoom, {IPoints} from '../types/IRoom';
import backCard from '../images_card/logo.png';
import {v4 as uuidv4} from 'uuid';

type MemoryMechanismProps = {};

const MemoryMechanism: React.FC<MemoryMechanismProps> = () => {
	const [cards, setCards] = useState<CardType[]>(createBoard4x4());
	const [gameWon, setGameWon] = useState(false);
	const [matchedPairs, setMatchedPairs] = useState(0);
	const [clickedCard, setClickedCard] = useState<undefined | CardType>(undefined);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

	const {id: roomId} = useParams<string>();

	const [searchParams, setSearchParams] = useSearchParams();
	const selectedLevel = searchParams.get('level') || 'easy';
	const boardSize = selectedLevel === 'easy' ? 4 : 6;



	const handleCardClick = (currentClickedCard: CardType) => {
	    // Flip the card
	    setCards((prev) =>
	        prev?.map((card) =>
	            card.id === currentClickedCard.id ? { ...card, flipped: true, clickable: false } : card
	        )
	    );
	    If this is the first card that is flipped
	    just keep it flipped
	    if (!clickedCard) {
	        setClickedCard({ ...currentClickedCard });
	        return;
	    }

	    // If it's a match
	    if (clickedCard.matchingCardId === currentClickedCard.id) {
	        setMatchedPairs((prev) => prev + 1);
	        setCards((prev) =>
	            prev.map((card) =>
	                card.id === clickedCard.id || card.id === currentClickedCard.id ? { ...card, clickable: false } : card
	            )
	        );
	        setClickedCard(undefined);
	        return;
	    }

	    // If it's not a matched pair, wait one second and flip them back
	    const id = setTimeout(() => {
	        setCards((prev) =>
	            prev.map((card) =>
	                card.id === clickedCard.id || card.id === currentClickedCard.id
	                    ? { ...card, flipped: false, clickable: true }
	                    : card
	            )
	        );
	    }, 450);
	    setClickedCard(undefined);
	    setTimeoutId(id);
	};

	// Cleanup function
	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

	return (
		<div>
			<Timer gameWon={gameWon}/>
			{cards && <Grid $boardSize={boardSize}>
				{cards.map((card) => (
				    <Card key={uuidv4()} card={card} callback={handleCardClick} />
				))}
			</Grid>}
		</div>
	);
};

export default MemoryMechanism;
