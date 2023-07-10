import React, {useState} from 'react';
import {Copy, Headline2} from './App.styles';
import logo from '../assets/logo.png';
import '../styles/logo.css';

const WaitingForOpponentToJoin = () => {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
		setIsCopied(true)
	};

	return <div style={{
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "90vh",
		overflowY: "hidden"
	}}>
		<img
			src={logo}
			alt="Logo"
			style={{
				display: "block",
				margin: "0 auto",
				marginBottom: "16px",
				animation: "logo-animation 3.5s linear infinite"
			}}
			className="logo-animation"
		/>
		<Headline2 style={{alignItems: "center"}}>Waiting for opponent to join...</Headline2>
		<Copy onClick={copyToClipboard}>{isCopied ? "Copied to clipboard!" : "Click here to copy link!"}</Copy>
	</div>
};

export default WaitingForOpponentToJoin;
