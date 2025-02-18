import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (userInfo) {
            sessionStorage.setItem("user", JSON.stringify(userInfo));
        } else {
            sessionStorage.removeItem("user");
        }
    }, [userInfo]);

    return (
        <UserContext.Provider value={{ userInfo: userInfo, setUserInfo: setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

