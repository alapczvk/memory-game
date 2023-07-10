import React, {useEffect, useState} from 'react';
import {Div} from './App.styles';

type TimerProps = {
	gameWinner: 'a' | 'b' | 'draw' | null;
};

const Timer: React.FC<TimerProps> = ({gameWinner}) => {
	const [time, setTime] = useState(0);

	useEffect(() => {
		if (gameWinner) {
			return;
		}

		const timerId = setInterval(() => {
			setTime((prevTime) => prevTime + 1);
		}, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, [gameWinner]);

	const formatTime = (timeInSeconds: number): string => {
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = timeInSeconds % 60;

		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return <Div>Time: {formatTime(time)}</Div>;
};

export default Timer;
