import styled from 'styled-components';

export const Grid = styled.div<{ $boardSize: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$boardSize}, minmax(50px, 1fr));
  grid-gap: .5rem;
  max-width: 600px;
  margin: .3rem auto;
  overflow: hidden;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;


export const Button = styled.button`
  background-color: rgba(255, 64, 129, 0.49);
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.5s;
  align-items: center;
  display: flex;
  justify-content: center;
  align-content: center;
  height: 10rem;
  width: 10rem;

  &:hover {
    background-color: #7b3148;
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px rgba(255, 64, 129, 0.8);
    z-index: 1;
    transform-style: preserve-3d;
  }
`;

export const Headline = styled.h1`
  font-size: 3rem;
  color: #7b3148;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'monospace', serif;
`;

export const Div = styled.div`
  font-family: monospace;
  font-size: 20px;
  display: inline-flex;
  background-color: rgba(255, 64, 129, 0.49);
  padding: 10px 20px;
  border-radius: 20px;
`;

export const ButtonSmall = styled.button`
  font-family: monospace;
  font-size: 20px;
  display: inline-flex;
  background-color: rgba(255, 64, 129, 0.49);
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;

  &:hover {
    background-color: #7b3148;
  }
`;

export const Headline2 = styled.h3`
  font-size: 1.5rem;
  color: rgba(121, 3, 61, 0.82);
  //text-align: center;
  margin-bottom: 1.5rem;
  font-family: 'monospace', serif;
`;
