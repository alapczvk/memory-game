import React from 'react';
// Types
import {CardType} from "../setup";
// Styles
import { Wrapper, FrontImg, BackImg } from './Card.styles';

type Props = {
   card: CardType;
   disabled: boolean;
   callback: (card: CardType) => any;
};

const Card: React.FC<Props> = ({ card, disabled, callback }) => {
   const handleClick = () => {
      if (card.clickable && !disabled) callback(card);
   };

   return (
      <Wrapper onClick={handleClick}>
         <FrontImg $disabled={disabled} $clickable={card.clickable} $flipped={card.flipped} src={card.frontImage} alt='card-front' />
         <BackImg $disabled={disabled} $clickable={card.clickable} $flipped={card.flipped} src={card.backImage} alt='card-back' />
      </Wrapper>
   );
};

export default Card;