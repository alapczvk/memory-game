import InfoPage from './InfoPage';

const OpponentLeft = () => {
	return <InfoPage
		headlineText={'Your opponent left.'}
		buttonText={'Click here to restart this game'}
		buttonOnclick={() => window.location.reload()}
	/>;
};

export default OpponentLeft;
