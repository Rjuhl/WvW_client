import useOnlineStatus from "./onlineStatus";
import useGameHook from "./inGameHook";
import useErrorHandler from "./errorHandler";

const useBaseHooks = () => {
    useOnlineStatus();
    useGameHook();
    useErrorHandler();
}

export default useBaseHooks;