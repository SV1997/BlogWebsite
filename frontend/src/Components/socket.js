import io from 'socket.io-client';
const socket=io('https://blogwebsite-1-wxmh.onrender.com')
console.log(socket,"socket");
export default socket;