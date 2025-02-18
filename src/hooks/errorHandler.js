import { useLocation, useNavigate } from "react-router-dom"
import { useGame } from "../components/providers/gameContext";
import { useEffect } from "react";
import { useUser } from "../components/providers/context";

const useErrorHandler = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useUser();

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
        };
    }, [userInfo]);
};

export default useErrorHandler;