import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
let io: Server;
const server={
    init: (server:HTTPServer)=>{
io = new Server(server,{
  cors:{
    origin:'https://blog-website-seven-ecru.vercel.app',
    methods:["GET","POST"],
    credentials:true
  }
})
return io;
},
getIO:()=>{
    if(!io){
        throw new Error('Socket.io not initialized')
    }
    return io;
}}

export default server