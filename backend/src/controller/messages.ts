import { Request, Response } from 'express';
import { PrismaClient, Post,user, comment,messages, contacts } from '@prisma/client'; // Import the userUpdateInput type
import serverio from '../socket'
import { create } from 'domain';
const client= new PrismaClient();
async function createChatId(req:Request,res:Response){
  try {const receiverId=req.body.email;
  const senderId=req.cookies.email;
  const sender=await client.user.findUnique({
    where:{
      email:senderId
    }})
  const receiver=await client.user.findUnique({
    where:{
      email:receiverId
    }})
  const message=await client.messages.create({
    data:{
      userArray:{
        connect:[
          {id:sender?.id},
          {id:receiver?.id}
        ]
      }
    }
  })
  res.status(200).json({message:"Chat created"})}
  catch (error) {
    //console.log(error);
  }
}


async function setContacts(req:Request,res:Response){
const email=req.body.email;
//console.log(email,"email");

const user=await client.user.findFirst({
where:{
  email:req.cookies.email
},
include:{
  contacts:true
}
})
const isPresent=user?.contacts.some((contact:contacts)=>{//console.log(contact.userId,contact.friendId,(contact.userId===email)||(contact.friendId===email),"contact.userId");
  return (contact.userId===email)||(contact.friendId===email)});
//console.log(isPresent,"isPresent");

if(isPresent){
  return res.status(200).json({message:"Contact already added"})
}
const friend: user | null = await client.user.findUnique({
  where:{
    email:email
  }
})
// //console.log(friend,"friend");
// if (user&&user.email && friend && friend.email) {
  const createContacts = await client.contacts.create({
    data: {
        friendname: req.body.name,
        username: user?.name,
        user: {
            connect: {
                email: user?.email  // Ensure we're connecting using the correct email
            }
        },
        friend: {
          connect: {
          email: friend?.email
          }
        }
  
    }
  });
  // return res.status(400).json({ message: "Friend email is missing" });
// }

if (!friend|| !friend.email) {
  return res.status(404).json({ message: "Friend not found" });
}

//console.log(createContacts,"createContacts");

const newContacts: contacts[] = user?.contacts.map(contact => contact) || [];
// const newContacts2=[...newContacts,{id:createContacts.id,userId:email,name:createContacts.friendname}];
// const editedContacts = await client.user.update({
//   where: {
//     email: req.cookies.email
//   },
//   data: {
//     contacts:{set: newContacts2.map(contact => ({...contact}))}
//    } ,
//   include:{
//   contacts:true
//   }
// });
// //console.log(editedContacts,"editedContacts");

res.status(200).json({message:"Contact added"})
}

async function sendContacts(req:Request,res:Response){
  const email=req.cookies.email;
  const socketid= req.cookies.socketId;
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hash= "message"+email
  console.log(hash, socketid,"hash 110");
  
  const user=await client.user.findUnique({
    where:{
      email:email
    },
    include:{
      contacts:true,
      friendContacts:true
    }
  })
  // //console.log(user?.contacts,"contacts");
    //console.log("socketif");
    if(user){const socket=serverio.getIO();
const userSocket=socket.sockets.sockets.get(socketid);
console.log(userSocket);

await userSocket?.join(hash);
console.log(userSocket?.rooms,"hash 125 sendcontacts");
}
const newContactsArray=[...(user?.contacts||[]),...(user?.friendContacts||[])]    
const contacts=newContactsArray.map(contact=>{
if(user?.email===contact.userId){
  return{name:contact.friendname,email:contact.friendId}
}
else if(user?.email===contact.friendId){
  return{name:contact.username,email:contact.userId}
}
})
//console.log(contacts);

  res.json(contacts)
}

async function setChat(req:Request,res:Response){
try{  //console.log(req.body,"setChat");

const {user,reciever}=req.body;
if((!reciever)||(!user)){
  return res.status(400).json({message:"Reciever or user not found"})
}
const participants=[user,reciever]
const socketid= req.cookies.socketId;
const encoder = new TextEncoder();
const data = encoder.encode(reciever);
const hash= 'message'+reciever
//console.log(hash,"hash");

const message=await client.messages.findFirst({
  where:{
    userArray:{
      every:{
        email:{
          in:participants
        }
      }
    }
  },
  include:{
  messageContent:true,
  userArray:true
  }
})
//console.log(message);
const socket=serverio.getIO();
const userSocket=socket.sockets.sockets.get(socketid);
console.log(hash,"hash setchat 171");

userSocket?.join(hash);
console.log(userSocket?.rooms,"rsocketres 174");

//console.log("userSocket",socketid);

userSocket?.to(hash).emit('message','room joined')

res.status(200).json({messageContent:message?.messageContent,messageId:message?.id})}
catch(error){
  console.log(error);
}
}

async function sendMessage(req:Request, res:Response) {
  const {message, author,friend} = req.body;
  const messageId:number = req.body.messageId;
  const socketid= req.cookies.socketId;
  const encoder = new TextEncoder();
  const data = encoder.encode(friend);
  const hash= "message"+friend
  const messageData = await client.messageContent.create({
    data: {
      content: message,
      authorId: author,
      messageId: messageId
  }
})
//console.log(hash,"sendmessage");

const socket=serverio.getIO();
const userSocket=socket.sockets.sockets.get(socketid);
userSocket?.to(hash).emit('message',{message:messageData.content,author:author})
const updateMessage=await client.messages.update({
  where:{
    id:messageId
  },
  data:{
    messageContent:
        {
          connect:{
            id:messageData.id
          }
        }
  }
})
//console.log(updateMessage);

  res.send(message);
}

const messageController = {createChatId,setContacts,setChat,sendMessage, sendContacts};

export default messageController;