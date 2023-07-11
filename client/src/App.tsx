import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {SocketProvider} from './contexts/SocketContext';
import MemoryMechanism from './components/MemoryMechanism';
import StartPage from './components/StartPage';
import './styles/App.css';


const App = () => {
	return <Router>
		<SocketProvider>
			<Routes>
				<Route index path="/" element={<StartPage/>}/>
				<Route path="/:roomId" element={<MemoryMechanism/>}/>
				<Route path="*" element={<div>404 Not Found</div>}/>
			</Routes>
		</SocketProvider>
	</Router>;
};

export default App;
