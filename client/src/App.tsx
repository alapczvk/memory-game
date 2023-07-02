import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import MemoryMechanism from "./Components/MemoryMechanism";
import StartPage from "./Components/StartPage";
import {SocketProvider} from "./contexts/SocketContext";

const App = () => {
    const [level, setLevel] = useState<"easy" | "medium">();

    // useEffect(() => {
    //     const so = io('localhost:5000');
    //     so.on('greeting-from-server', data => {
    //         console.log(data);
    //     })
    // })
    const handleStartGame = (selectedLevel: 'easy' | 'medium') => {
        setLevel(selectedLevel);
    };


    return (
        <SocketProvider>
        <div>
            {!level ? (
                <StartPage onStart={handleStartGame}/>
            ) : (
                <MemoryMechanism selectedLevel={level}/>
            )}
        </div>
        </SocketProvider>
    );
};

export default App;
