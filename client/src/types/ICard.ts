export default interface ICard {
	id: number;
	boardIdx: number;
	flipped: boolean;
	backImage: string;
	frontImage: string;
	clickable: boolean;
};
