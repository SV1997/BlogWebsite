import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
let io: Server;
const server={
    init: (server:HTTPServer)=>{
io = new Server(server,{
  cors:{
    origin:'https://blog-website-p12mz2hi5-saharsh-vahsishthas-projects.vercel.app',
    methods:["GET","POST"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token","Access-Control-Allow-Origin"],
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