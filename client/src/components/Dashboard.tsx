import React from 'react';
import Timer from './Timer';
import {IPoints} from '../types/IRoom';

type MemoryMechanismProps = {
	winner: 'a' | 'b' | 'draw' | null,
	amIPlayerA: boolean | null,
	isMyTurn: boolean | null,
	playerAPoints: IPoints,
	playerBPoints: IPoints
};

const Dashboard: React.FC<MemoryMechanismProps> = ({winner, amIPlayerA, isMyTurn, playerAPoints, playerBPoints}) => {
	return <>
		<Timer gameWinner={winner}/>

		<h2>{winner === 'draw' && 'It\'s a draw!'}</h2>

		<h2>
			{winner != null && winner !== 'draw' &&
				(((winner === 'a' && amIPlayerA) || (!amIPlayerA && winner === 'b')) ?
					'You won!' :
					'Your opponent won!')
			}
		</h2>

		{isMyTurn != null && winner == null &&
          <h2>
				 {isMyTurn ?
					 'It\'s your turn!' :
					 'It\'s your opponent\'s turn!'}
          </h2>
		}

		{playerAPoints !== null && playerBPoints !== null &&
          <>
              <div>You: {JSON.stringify(amIPlayerA ? playerAPoints : playerBPoints)}</div>
              <div>Opponent: {JSON.stringify(!amIPlayerA ? playerAPoints : playerBPoints)}</div>
          </>
		}
	</>;
};

export default Dashboard;
