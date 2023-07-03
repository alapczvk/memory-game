import React, { useEffect, useState } from 'react';
import {TimerDiv} from "./App.styles";

type TimerProps = {
    gameWon: boolean;
};

const Timer: React.FC<TimerProps> = ({ gameWon }) => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (gameWon) {
            return;
        }

        const timerId = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [gameWon]);
    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    return (
        <TimerDiv>
            Time: {formatTime(time)}
        </TimerDiv>
    );
};

export default Timer;
