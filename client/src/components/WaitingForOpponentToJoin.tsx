import {useState} from 'react';
import InfoPage from './InfoPage';

const WaitingForOpponentToJoin = () => {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
		setIsCopied(true)
	};

	return <InfoPage
		headlineText={'Waiting for opponent to join...'}
		buttonText={isCopied ? 'Copied to clipboard!' : 'Click here to copy link!'}
		buttonOnclick={copyToClipboard}
	/>;
};

export default WaitingForOpponentToJoin;
