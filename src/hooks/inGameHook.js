import { useEffect, useContext } from "react";
import { useGame } from "../components/providers/gameContext";
import { useLocation, useNavigate } from 'react-router-dom';

const useGameHook = () => {
    const location = useLocation();
    const { gameContext, setGameContext } = useGame();
    const gamePages = ["/turn-select", "/resolve-turn"]
    const navigate = useNavigate();
    useEffect(() => {
        if (gameContext) {
            if (location.pathname !== gamePages[1] && gameContext.winner) {
                navigate(gamePages[1])
            } else {
                if (gameContext.location !== location.pathname) {
                    navigate(gameContext.location);
                }
            }
        }

        if (!gameContext && gamePages.includes(location.pathname)) {
            navigate('/home');
        };
    }, [location]);
};

export default useGameHook;