// Fisher-Yates shuffle algorithm
export const shuffleArray = (array: any[]): any[] => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

export const getRandomArray = (numberOfCardsAvailable: number, arrayLength: number) => {
	const array = [];

	for (let i = 0; i < numberOfCardsAvailable; i++) {
		array.push(i);
	}

	return shuffleArray(array).slice(0, Math.min(arrayLength, numberOfCardsAvailable));
};

export const getRandomBinaryDigit = () => {
	return Math.floor(Math.random() * 2);
};
