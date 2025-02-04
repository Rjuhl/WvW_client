import { useContext, useEffect, useRef } from "react";
import GameContext from "../../components/providers/gameContext";
import Context from "../../components/providers/context.js";
import useNavigationGuard from "../../hooks/useNavigationGuard.js";

export default function GameEnd() {
    const effectRun = useRef(false);
    const navigate = useNavigationGuard();
    const [gameContext, setGameContext] = useContext(GameContext);
    const [userInfo, setUserInfo] = useContext(Context);

    useEffect(() => {
        if (!effectRun.current && userInfo.username === gameContext.winner) {
            userInfo.money += 10;
            setUserInfo(userInfo);
            effectRun.current = true;
        }
    }, [gameContext]);

    return (
        <div className="overlay">
            {userInfo.username === gameContext.winner && <h1 className="gold-reward">+10💰</h1>}
            <div className="overlay-content">
                <h1 className="celebration-header">{`${gameContext.winner} wins! 🎉`}</h1>
                <button 
                    className="endgame-button" 
                    onClick={() => { setGameContext(undefined); navigate("/home"); }}
                >
                    Home
                </button>
            </div>
        </div>
    );
}

