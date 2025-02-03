import io from 'socket.io-client';

const socket = io('https://wvw-server-gtnd.onrender.com', { autoConnect: false });

export default socket;