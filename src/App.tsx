import React, { useState } from 'react';
import MemoryMechanism from "./MemoryMechanism";
import StartPage from "./StartPage";
const App = () => {
    const [level, setLevel] = useState<"easy" | "medium">();

    const handleStartGame = (selectedLevel:'easy' | 'medium') => {
        setLevel(selectedLevel);
    };


    return (
        <div>
            {!level ? (
                <StartPage onStart={handleStartGame} />
            ) : (
                <MemoryMechanism selectedLevel={level}/>
            )}
        </div>
    );
};

export default App;
