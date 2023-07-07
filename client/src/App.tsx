import React from 'react';
import MemoryMechanism from './components/MemoryMechanism';
import StartPage from "./components/StartPage";
import {SocketProvider} from './contexts/SocketContext';
import {BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

const App = () => {
	return <Router>
		<SocketProvider>
			<Routes>
				<Route index path="/" element={<StartPage/>}/>
				<Route path="/room">
					<Route path="" element={<Navigate to={`/room/${uuidv4()}`}/>}/>
					<Route path=":id" element={<MemoryMechanism/>}/>
				</Route>
				<Route path="*" element={<div>404 Not Found</div>}/>
			</Routes>
		</SocketProvider>
	</Router>;
};

export default App;
