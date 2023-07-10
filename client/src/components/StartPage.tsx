import React from 'react';
import {Button, Headline} from './App.styles';
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from 'react-router-dom';

type StartPageProps = {};

const StartPage: React.FC<StartPageProps> = () => {
	const navigate = useNavigate();

	const onStart = (boardSize: number) => navigate(`/${uuidv4()}?boardSize=${boardSize}`);

	return <div style={{alignItems: "center", display: "flex", flexDirection: "column"}}>
		<Headline>2-player Memory Game</Headline>
		<div style={{flexDirection: "row"}}>
			<Button onClick={() => onStart(4)} style={{margin: '1rem'}}>Easy: 4x4</Button>
			<Button onClick={() => onStart(6)} style={{margin: '1rem'}}>Medium: 6x6</Button>
		</div>
	</div>;
};

export default StartPage;
