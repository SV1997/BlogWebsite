import io from 'socket.io-client';
const socket=io('https://shark-app-ahkas.ondigitalocean.app')
console.log(socket);
export default socket;