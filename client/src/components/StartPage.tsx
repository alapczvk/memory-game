import React, {useState} from 'react';
import {Button, ButtonGroup, ButtonSmall, Headline, Headline2} from './App.styles';
import {v4 as uuidv4} from 'uuid';
import {useNavigate} from 'react-router-dom';

type StartPagePropsType = {};

const StartPage: React.FC<StartPagePropsType> = () => {
	const [boardSize, setBoardSize] = useState<number | null>(null);
	const [cardTheme, setCardTheme] = useState<string | null>(null);

	const navigate = useNavigate();

	const startGame = () => {
		if (boardSize === null) return alert('Please select a level');
		if (cardTheme === null) return alert('Please select a card theme');

		navigate(`/${uuidv4()}?boardSize=${boardSize}&cardTheme=${cardTheme}`);
	}

	return <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
		<Headline>2-player Memory Game</Headline>

		<Headline2>Choose level</Headline2>
		<ButtonGroup>
			<Button
				onClick={() => setBoardSize(prevState => prevState === 4 ? null : 4)}
				style={{margin: '.5rem 1rem', backgroundColor: boardSize === 4 ? '#7b3148' : ''}}>
				Easy: 4x4
			</Button>
			<Button
				onClick={() => setBoardSize(prevState => prevState === 6 ? null : 6)}
				style={{margin: '.5rem 1rem', backgroundColor: boardSize === 6 ? '#7b3148' : ''}}>
				Medium: 6x6
			</Button>
		</ButtonGroup>

		<Headline2 style={{marginTop: '3rem'}}>Choose card theme</Headline2>
		<ButtonGroup>
			<Button
				onClick={() => setCardTheme(prevState => prevState === 'dogs' ? null : 'dogs')}
				style={{margin: '.5rem 1rem', backgroundColor: cardTheme === 'dogs' ? '#7b3148' : ''}}>
				Dogs
			</Button>
			<Button
				onClick={() => setCardTheme(prevState => prevState === 'teleinfa' ? null : 'teleinfa')}
				style={{margin: '.5rem 1rem', backgroundColor: cardTheme === 'teleinfa' ? '#7b3148' : ''}}>
				Teleinfiarze
			</Button>
		</ButtonGroup>

		<ButtonSmall
			style={{margin: '3rem', width: '10rem'}}
			onClick={startGame}
		>Start game</ButtonSmall>
	</div>;
};

export default StartPage;
