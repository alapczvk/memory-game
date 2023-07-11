import InfoPage from './InfoPage';
import {useNavigate} from 'react-router-dom';

const RoomIsFullError = () => {
	const navigate = useNavigate();

	return <InfoPage
		headlineText={'This room is already full.'}
		buttonText={'Back to homepage'}
		buttonOnclick={() => navigate('/')}
	/>
};
export default RoomIsFullError;
