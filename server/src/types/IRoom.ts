export default interface IRoom {
	id: string,
	createdBySocketId: string,
	joinedBySocketId: string | null,
	board: number[],
	guessedCardsIndexes: number[],
	boardSize: number,
	playerA: IPoints,
	playerB: IPoints,
	turn: string,
	createdAt: Date
};

export interface IPoints {
	points: number,
	attempts: number,
}
