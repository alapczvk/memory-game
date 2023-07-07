import card1 from './assets/dogs/card1.png';
import card2 from './assets/dogs/card2.png';
import card3 from './assets/dogs/card3.png';
import card4 from './assets/dogs/card4.png';
import card5 from './assets/dogs/card5.png';
import card6 from './assets/dogs/card6.png';
import card7 from './assets/dogs/card7.png';
import card8 from './assets/dogs/card8.png';
import card9 from './assets/dogs/card9.png';
import card10 from './assets/dogs/card10.png';
import card11 from './assets/dogs/card11.png';
import card12 from './assets/dogs/card12.png';
import card13 from './assets/dogs/card13.png';
import card14 from './assets/dogs/card14.png';
import card15 from './assets/dogs/card15.png';
import card16 from './assets/dogs/card16.png';
import card17 from './assets/dogs/card17.png';
import card18 from './assets/dogs/card18.png';

import cardBack from './assets/logo.png';

import ICard from './types/ICard';

const cards: string[] = [card1, card2, card3, card4, card5, card6, card7, card8, card9, card10, card11, card12, card13, card14, card15, card16, card17, card18];

export const createBoard = (board: number[]): ICard[] => {
	return board.map((card, i) => ({
		id: i,
		boardIdx: card,
		flipped: false,
		backImage: cardBack,
		frontImage: cards[card],
		clickable: true
	}));
};
