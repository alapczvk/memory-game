import React from 'react';
import Timer from './Timer';
import {IPoints} from '../types/IRoom';
import {Headline2, Div, ButtonSmall} from './App.styles';

type DashboardPropsType = {
	winner: 'a' | 'b' | 'draw' | null,
	amIPlayerA: boolean | null,
	isMyTurn: boolean | null,
	playerAPoints: IPoints,
	playerBPoints: IPoints
};

const Dashboard: React.FC<DashboardPropsType> = ({winner, amIPlayerA, isMyTurn, playerAPoints, playerBPoints}) => {
	return <div style={{padding: '.3rem', width: '70%', backgroundColor: 'lightblue', borderRadius: '20px'}}>
		<Timer style={{margin: '1rem'}} gameWinner={winner}/>

		{winner !== null &&
          <ButtonSmall
              style={{margin: '0 1rem'}}
              onClick={() => window.location.reload()}>
              Click here to restart
          </ButtonSmall>}

		<Headline2 style={{margin: '2rem'}}>
			{winner != null && winner !== 'draw' &&
				(((winner === 'a' && amIPlayerA) || (!amIPlayerA && winner === 'b')) ?
					'You won!' :
					'Your opponent won!')
			}
			{winner === 'draw' && 'It\'s a draw!'}

			{winner == null && isMyTurn != null &&
				(isMyTurn ? 'It\'s your turn!' : 'It\'s your opponent\'s turn!')
			}
		</Headline2>

		{playerAPoints !== null && playerBPoints !== null &&
          <div>
              <Div style={{margin: '1rem'}}>You: {amIPlayerA ? playerAPoints.points : playerBPoints.points}</Div>
              <Div>Opponent: {!amIPlayerA ? playerAPoints.points : playerBPoints.points}</Div>
          </div>
		}
	</div>;
};

export default Dashboard;
