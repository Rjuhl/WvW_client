import { createContext, useState, useEffect, useContext } from "react";

const GameContext = createContext(undefined)

export const GameProvider = ({ children }) => {
    const [gameContext, setGameContext] = useState(() => {
        const savedGame = sessionStorage.getItem("game");
        return savedGame ? JSON.parse(savedGame) : null;
    });

    useEffect(() => {
        if (gameContext) {
            sessionStorage.setItem("game", JSON.stringify(gameContext));
        } else {
            sessionStorage.removeItem("game");
        }
    }, [gameContext]);

    return (
        <GameContext.Provider value={{ gameContext: gameContext, setGameContext: setGameContext }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);