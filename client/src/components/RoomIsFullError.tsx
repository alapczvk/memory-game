import React from 'react';
import {Copy, Headline2} from './App.styles';
import doNotEnter from '../assets/Do not enter sign-pana.png';
import {Link} from "react-router-dom";

const RoomIsFullError = () => {

	return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '97vh', overflowY: 'hidden' }}>
		<Headline2 style={{ marginRight: '10px' }}>This room is already full.</Headline2>
		<Copy style={{marginTop:"5px"}}>
			<Link to="/" style={{ textDecoration: 'none' }}>Back to homepage</Link>
		</Copy>
		<img src={doNotEnter} alt="STOP! THIS ROOM IS FULL" style={{ height: '85vh' }} />
	</div>
};
export default RoomIsFullError;
