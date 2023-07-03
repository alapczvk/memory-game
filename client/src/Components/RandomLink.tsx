import React from 'react';
import StartPage from "./StartPage";
import { v4 as uuidv4 } from 'uuid';
const RandomLink : React.FC = () => {
    const handleStart = (selectedLevel: 'easy' | 'medium') => {
        const randomLink = generateGameLink(selectedLevel);
        window.open(randomLink, '_blank');
    };

    const generateGameLink = (selectedLevel: 'easy' | 'medium') => {
        const baseURL = 'https://localhost:5000/game/';
        const gameLink = `${baseURL}?level=${uuidv4()}`;
        return gameLink;
    };

    return (
        <div>
            <StartPage onStart={handleStart} />
        </div>
    );
};

export default RandomLink;