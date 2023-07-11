import React from 'react';
import {ButtonSmall, Headline2} from './App.styles';
import logo from '../assets/logo.png';
import '../styles/logo.css';

type InfoPagePropsType = {
	headlineText: string,
	buttonText: string,
	buttonOnclick: () => any
};

const InfoPage: React.FC<InfoPagePropsType> = ({headlineText, buttonText, buttonOnclick}) => {
	return <div style={{
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '90vh',
		overflowY: 'hidden'
	}}>
		<img
			src={logo}
			alt='Logo'
			style={{
				display: 'block',
				margin: '0 auto',
				marginBottom: '16px',
				animation: 'logo-animation 3.5s linear infinite'
			}}
			className='logo-animation'
		/>
		<Headline2 style={{alignItems: 'center'}}>{headlineText}</Headline2>
		<ButtonSmall onClick={buttonOnclick}>{buttonText}</ButtonSmall>
	</div>;
};

export default InfoPage;
