import React from 'react';
import { Wrapper, FrontImg, BackImg } from './Card.styles';
import ICard from '../types/ICard';

type CardProps = {
   card: ICard;
   disabled: boolean;
   callback: (card: ICard) => any;
};

const Card: React.FC<CardProps> = ({ card, disabled, callback }) => {
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