import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuth();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    if (authUser) {
      const socketInstance = io(`${BASE_URL}`, {
        withCredentials: true,
        transports: ['websocket'],
        query: {
          userId: authUser._id,
        },
      });

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users || []);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setOnlineUsers([]);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};