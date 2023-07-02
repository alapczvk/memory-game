import Card from "./Components/Card";
import {createBoard4x4, createBoard6x6} from './setup';
import { shuffleArray } from './utils';
import { CardType } from './setup';
import { Grid } from './App.styles';
import {useEffect, useState} from "react";

type MemoryMechanismProps = {
    selectedLevel: 'easy' | 'medium';
};
const MemoryMechanism: React.FC<MemoryMechanismProps> = ({ selectedLevel }) => {
    const [cards, setCards] = useState<CardType[]>(shuffleArray(createBoard4x4()));
    const [gameWon, setGameWon] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [clickedCard, setClickedCard] = useState<undefined | CardType>(undefined);

    useEffect(() => {
        if (selectedLevel === 'easy') {
            const newCards = shuffleArray(createBoard4x4());
            setCards(newCards);
        } else {
            const newCards = shuffleArray(createBoard6x6());
            setCards(newCards);
        }
    }, [selectedLevel]);

    useEffect(() => {
        if (matchedPairs === cards.length / 2) {
            console.log('Game Won!');
            setGameWon(true);
        }
    }, [matchedPairs,cards]);

    const handleCardClick = (currentClickedCard: CardType) => {
        // Flip the card
        setCards(prev =>
            prev.map(card => (card.id === currentClickedCard.id ? { ...card, flipped: true, clickable: false } : card))
        );
        // If this is the first card that is flipped
        // just keep it flipped
        if (!clickedCard) {
            setClickedCard({ ...currentClickedCard });
            return;
        }

        // If it's a match
        if (clickedCard.matchingCardId === currentClickedCard.id) {
            setMatchedPairs(prev => prev + 1);
            setCards(prev =>
                prev.map(card =>
                    card.id === clickedCard.id || card.id === currentClickedCard.id ? { ...card, clickable: false } : card
                )
            );
            setClickedCard(undefined);
            return;
        }

        // If it's not a matched pair, wait one second and flip them back
        const timeoutId=setTimeout(() => {
            setCards(prev =>
                prev.map(card =>
                    card.id === clickedCard.id || card.id === currentClickedCard.id
                        ? { ...card, flipped: false, clickable: true }
                        : card
                )
            );
        }, 1000);
        setClickedCard(undefined);
    };

    return (
        <div>
            <Grid boardSize={selectedLevel === 'easy' ? 4 : 6}>
                {cards.map(card => (
                    <Card key={card.id} card={card} callback={handleCardClick} />
                ))}
            </Grid>
        </div>
    );
};

export default MemoryMechanism;