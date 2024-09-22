import { useEffect, useState } from 'react';
import Navigation from './Components/Sidebar/Navigation';
import './App.css';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Trending from './Components/Trendings/Trending';
import ResponsiveButtons from './Components/ResponsiveButtons';
import useSocket from './Components/useSocket';
import SocketContext from './Components/SocketContext';
import axios from 'axios';

function App() {
  const socket = useSocket();
  console.log(socket);

  const handleWindowChange = async (event) => {
    if (socket) {
      socket.disconnect();
    }
    navigator.sendBeacon('https://shark-app-ahkas.ondigitalocean.app/api/v1/user/windowleave');
    console.log('Window unload event');
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowChange);
    return () => window.removeEventListener('beforeunload', handleWindowChange);
  }, [socket]);

  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isSignup = location.pathname === '/signup';

  useEffect(() => {
    if (socket) {
      const socketIdHandler = (data) => {
        sessionStorage.setItem('socketId', data);
        console.log('Received socketId:', data);
      };

      socket.on('socketId', socketIdHandler);

      // Cleanup the event listener on unmount or when socket changes
      return () => {
        socket.off('socketId', socketIdHandler);
      };
    }
  }, [socket]);

  if (!(isLogin || isSignup)) {
    return (
      <SocketContext.Provider value={socket}>
      <div className="flex lg:flex-row">
        <div className="flex flex-col w-1/4">
          <Navigation />
        </div>
        <div className="border-gray-800 flex-col w-1/2 border-r-2 border-l-2 border-b-2 h-full">
          <ResponsiveButtons />
          <Outlet />
        </div>
        <div className="md:flex p-1/2 w-1/2 flex-col sd:w-1/4 hidden">
          <Trending />
        </div>
      </div>
      </SocketContext.Provider>
    );
  }

  return (
    <div className="flex justify-center align-center">
      <Outlet />
    </div>
  );
}

export default App;
