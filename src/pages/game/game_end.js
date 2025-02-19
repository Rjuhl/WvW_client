import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useGame } from "../../components/providers/gameContext";
import { useUser } from "../../components/providers/context.js";

export default function GameEnd() {
    const effectRun = useRef(false);
    const navigate = useNavigate();
    const { gameContext, setGameContext } = useGame();
    const { userInfo, setUserInfo } = useUser();

    useEffect(() => {
        if (!gameContext) {
            navigate('/home');
        }

        if (!effectRun.current && gameContext && userInfo.username === gameContext.winner) {
            userInfo.money += 10;
            setUserInfo({ ...userInfo }); 
            effectRun.current = true;
        }

        const handlePopState = () => {
            if (gameContext?.winner) {
                setGameContext(undefined);
            }
        };

        const handleBeforeUnload = () => {
            if (gameContext?.winner) {
                setGameContext(undefined);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    if (!gameContext) return null;
    return (
        <div className="overlay">
            {userInfo.username === gameContext.winner && <h1 className="gold-reward">+10💰</h1>}
            <div className="overlay-content">
                <h1 className="celebration-header">{`${gameContext.winner} wins! 🎉`}</h1>
                <button 
                    className="endgame-button" 
                    onClick={() => {
                        setGameContext(undefined);
                        navigate("/home");
                    }}
                >
                    Home
                </button>
            </div>
        </div>
    );
}
