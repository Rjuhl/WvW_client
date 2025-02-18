import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../components/providers/context'
import Online from '../components/providers/online';
import socket from '../socket'

const useOnlineStatus = () => {
    const location = useLocation();
    const [online, setOnline] = useContext(Online)
    const { userInfo, setUserInfo } = useUser()
    let sentUpdate = false

    useEffect(() => {
        if (userInfo && location.pathname !== '/' && !online && !sentUpdate) {
            socket.connect()
            socket.emit('userOnline', userInfo.username, userInfo.password)
            setOnline(true)
            sentUpdate = true
        }

        if (userInfo && location.pathname === '/' && online && !sentUpdate) {
            socket.emit('userOffline', userInfo.username)
            setOnline(false)
            sentUpdate = true
            socket.disconnect()
        }

        const handleBeforeUnload = () => {
            if (userInfo) {
                socket.emit('userOffline', userInfo.username)
                socket.disconnect()
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [location, userInfo])
}

export default useOnlineStatus