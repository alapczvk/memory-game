import React from 'react';
import Timer from './Timer';
import {IPoints} from '../types/IRoom';
import {Headline2, Div} from "./App.styles";

type DashboardProps = {
	winner: 'a' | 'b' | 'draw' | null,
	amIPlayerA: boolean | null,
	isMyTurn: boolean | null,
	playerAPoints: IPoints,
	playerBPoints: IPoints
};

const Dashboard: React.FC<DashboardProps> = ({winner, amIPlayerA, isMyTurn, playerAPoints, playerBPoints}) => {
	return <>
		<Timer gameWinner={winner}/>

		<h2>{winner === 'draw' && 'It\'s a draw!'}</h2>

		<Headline2>
			{winner != null && winner !== 'draw' &&
				(((winner === 'a' && amIPlayerA) || (!amIPlayerA && winner === 'b')) ?
					'You won!' :
					'Your opponent won!')
			}
		</Headline2>

		{isMyTurn != null && winner == null &&
          <Headline2 style={{alignItems: "left"}}>
				 {isMyTurn ?
					 'It\'s your turn!' :
					 'It\'s your opponent\'s turn!'}
          </Headline2>
		}

		{playerAPoints !== null && playerBPoints !== null &&
          <>
              <Div style={{marginRight: "5px"}}>You: {amIPlayerA ? playerAPoints.points : playerBPoints.points}</Div>
              <Div>Opponent: {!amIPlayerA ? playerAPoints.points : playerBPoints.points}</Div>
          </>
		}
	</>;
};

export default Dashboard;
