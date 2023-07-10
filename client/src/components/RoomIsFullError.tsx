import React from 'react';
import {Headline2} from "./App.styles";
import doNotEnter from '../assets/Do not enter sign-pana.png';

const RoomIsFullError = () => {

	return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', overflowY: "hidden" }}>
			<span style={{ position: 'absolute', top: 0 }}>This room is already full :). Choose another one</span>
		<img src={doNotEnter} alt={"STOP! THIS ROOM IS FULL"} style={{ height: "85vh" }} />
		{/*<Headline2 style={{alignItems:"center"}}>This room is full!</Headline2>*/}
		<a style={{ position: 'absolute', bottom: 0 }} href="https://storyset.com/data">Data illustrations by Storyset</a>
	</div>
};

export default RoomIsFullError;
