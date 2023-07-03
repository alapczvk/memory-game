import React, { useState, useEffect } from 'react';
import { Choose, Headline } from "./App.styles";
import { v4 as uuidv4 } from 'uuid';

type StartPageProps = {
    onStart: (selectedLevel: 'easy' | 'medium') => void;
};

const StartPage: React.FC<StartPageProps> = ({ onStart }) => {
    const [selectedLevel, setSelectedLevel] = useState('');
    const [randomLink, setRandomLink] = useState('');

    const generateRandomLink = () => {
        const uuid = uuidv4();
        setRandomLink(uuid);
    };

    useEffect(() => {
        generateRandomLink();
    }, []);

    const handleLevelSelect = (level: 'easy' | 'medium') => {
        setSelectedLevel(level);
        onStart(level);
    };

    return (
        <div style={{ alignItems: "center", display: "flex", flexDirection: "column" }}>
            <Headline>2-player Memory Game</Headline>
            <div style={{ flexDirection: "row" }}>
                <Choose onClick={() => handleLevelSelect('easy')}>Easy: 4x4</Choose>
                <Choose onClick={() => handleLevelSelect('medium')}>Medium: 6x6</Choose>
            </div>
        </div>
    );
};

export default StartPage;
