export const roomExists = (roomId: string, rooms) => {
	return rooms[roomId] != null;
};

export const isRoomJoined = (roomId: string, rooms) => {
	return rooms[roomId].joinedBySocketId != null;
};

export const isGuessCorrect = (guess: number[], board: number[]) => {
	return board[guess[0]] === board[guess[1]];
};

export const getRandomArray = (N: number) => {
	const array = [];

	for (let i = 1; i <= N; i++) {
		array.push(i);
	}

	// Fisher-Yates shuffle algorithm
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

export const shuffleArray = (array: any[]): any[] => {
	return array
		.map(a => [Math.random(), a])
		.sort((a, b) => a[0] - b[0])
		.map(a => a[1]);
};

export const getRandomBinaryDigit = () => {
	return Math.floor(Math.random() * 2);
};
