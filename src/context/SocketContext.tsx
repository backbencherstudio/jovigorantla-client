// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { connectSocket } from '@/lib/socket';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (loading || !user?.id) return;

    const socketInstance = connectSocket();

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);

      // 🔥 Emit joinRoom with user id
      socketInstance.emit('joinRoom', { room_id: user.id });
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user?.id, loading]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
