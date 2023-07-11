import ICard from '../types/ICard';
import cardBack from '../assets/logo.png';
import dogs from './themes/dogs';
import teleinfa from './themes/teleinfa';
import config from '../config';

const getCards = (theme: string): string[] => {
	switch (theme) {
		case 'dogs':
			return dogs;

		case 'teleinfa':
			return teleinfa;

		default:
			return teleinfa;
	}
};

export const createBoard = (board: number[], theme: string=config.game.defaultCardTheme): ICard[] => {
	if (!config.game.cardThemes.includes(theme)) {
		theme = config.game.defaultCardTheme;
	}

	const cards = getCards(theme);

	return board.map((card, i) => ({
		id: i,
		boardIdx: card,
		flipped: false,
		backImage: cardBack,
		frontImage: cards[card],
		clickable: true
	}));
};
