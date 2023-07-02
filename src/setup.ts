import card1 from './images_card/card1.png';
import card2 from './images_card/card2.png';
import card3 from './images_card/card3.png';
import card4 from './images_card/card4.png';
import card5 from './images_card/card5.png';
import card6 from './images_card/card6.png';
import card7 from './images_card/card7.png';
import card8 from './images_card/card8.png';
import card9 from './images_card/card9.png';
import card10 from './images_card/card10.png';
import card11 from "./images_card/card11.png";
import card12 from "./images_card/card12.png";
import card13 from "./images_card/card13.png";
import card14 from "./images_card/card14.png";
import card15 from "./images_card/card15.png";
import card16 from "./images_card/card16.png";
import card17 from "./images_card/card17.png";
import card18 from "./images_card/card18.png";
import cardBack from './images_card/logo.png';

export type CardType = {
    id: string;
    flipped: boolean;
    backImage: string;
    frontImage: string;
    clickable: boolean;
    matchingCardId: string;
};

// Put the images in an array
const cards: string[] = [card1, card2, card3, card4, card5, card6, card7, card8,card9, card10, card11,card12,card13,card14,card15,card16,card17,card18];

export const createBoard4x4 = (): CardType[] => {
    const selectedCards = cards.slice(0, 8); // Wybierz pierwsze 8 elementów z tablicy cards
    const duplicatedCards = [...selectedCards, ...selectedCards];

    return duplicatedCards.map((card, i) => ({
        id: `card${i}`,
        flipped: false,
        backImage: cardBack,
        frontImage: card,
        clickable: true,
        matchingCardId: i < selectedCards.length ? `card${i + selectedCards.length}` : `card${i - selectedCards.length}`
    }));
};
export const createBoard6x6 = (): CardType[] => {
    const selectedCards = cards.slice(0, 18);
    const duplicatedCards = [...selectedCards, ...selectedCards];

    return duplicatedCards.map((card, i) => ({
        id: `card${i}`,
        flipped: false,
        backImage: cardBack,
        frontImage: card,
        clickable: true,
        matchingCardId: i < selectedCards.length ? `card${i + selectedCards.length}` : `card${i - selectedCards.length}`
    }));
};