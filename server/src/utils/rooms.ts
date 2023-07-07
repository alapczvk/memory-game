export const roomExists = (roomId: string, rooms) => {
	return rooms[roomId] != null;
};

export const isRoomJoined = (roomId: string, rooms) => {
	return rooms[roomId].joinedBySocketId != null;
};

export const isGuessCorrect = (guess: number[], board: number[]) => {
	return board[guess[0]] === board[guess[1]];
};

export const getRandomArray = (numberOfCardsAvailable: number, arrayLength: number) => {
	const array = [];

	for (let i = 0; i < numberOfCardsAvailable; i++) {
		array.push(i);
	}

	// Fisher-Yates shuffle algorithm
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array.slice(0, Math.min(arrayLength, numberOfCardsAvailable));
};

export const shuffleArray = (array: any[]): any[] => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

export const getRandomBinaryDigit = () => {
	return Math.floor(Math.random() * 2);
};
