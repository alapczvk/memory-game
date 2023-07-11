import InfoPage from './InfoPage';

const OpponentLeft = () => {
	return <InfoPage
		headlineText={'Your opponent left.'}
		buttonText={'Click here to start a new game'}
		buttonOnclick={() => window.location.reload()}
	/>;
};

export default OpponentLeft;
