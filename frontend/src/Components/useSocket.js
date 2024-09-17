// useSocket.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSockets = io('https://blogwebsite-1-wxmh.onrender.com');

    setSocket(newSockets);
    console.log(socket);
    
    // Log socket events for debugging
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
      newSocket.off(); // Remove all event listeners
      console.log('Socket disconnected and cleaned up');
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return socket;
};

export default useSocket;
