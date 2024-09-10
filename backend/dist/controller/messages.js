"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client"); // Import the userUpdateInput type
const socket_1 = __importDefault(require("../socket"));
const client = new client_1.PrismaClient();
function createChatId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const receiverId = req.body.email;
            const senderId = req.cookies.email;
            const sender = yield client.user.findUnique({
                where: {
                    email: senderId
                }
            });
            const receiver = yield client.user.findUnique({
                where: {
                    email: receiverId
                }
            });
            const message = yield client.messages.create({
                data: {
                    userArray: {
                        connect: [
                            { id: sender === null || sender === void 0 ? void 0 : sender.id },
                            { id: receiver === null || receiver === void 0 ? void 0 : receiver.id }
                        ]
                    }
                }
            });
            res.status(200).json({ message: "Chat created" });
        }
        catch (error) {
            //console.log(error);
        }
    });
}
function setContacts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        //console.log(email,"email");
        const user = yield client.user.findFirst({
            where: {
                email: req.cookies.email
            },
            include: {
                contacts: true
            }
        });
        const isPresent = user === null || user === void 0 ? void 0 : user.contacts.some((contact) => {
            return (contact.userId === email) || (contact.friendId === email);
        });
        //console.log(isPresent,"isPresent");
        if (isPresent) {
            return res.status(200).json({ message: "Contact already added" });
        }
        const friend = yield client.user.findUnique({
            where: {
                email: email
            }
        });
        // //console.log(friend,"friend");
        // if (user&&user.email && friend && friend.email) {
        const createContacts = yield client.contacts.create({
            data: {
                friendname: req.body.name,
                username: user === null || user === void 0 ? void 0 : user.name,
                user: {
                    connect: {
                        email: user === null || user === void 0 ? void 0 : user.email // Ensure we're connecting using the correct email
                    }
                },
                friend: {
                    connect: {
                        email: friend === null || friend === void 0 ? void 0 : friend.email
                    }
                }
            }
        });
        // return res.status(400).json({ message: "Friend email is missing" });
        // }
        if (!friend || !friend.email) {
            return res.status(404).json({ message: "Friend not found" });
        }
        //console.log(createContacts,"createContacts");
        const newContacts = (user === null || user === void 0 ? void 0 : user.contacts.map(contact => contact)) || [];
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
        res.status(200).json({ message: "Contact added" });
    });
}
function sendContacts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.cookies.email;
        const socketid = req.cookies.socketId;
        const encoder = new TextEncoder();
        const data = encoder.encode(email);
        const hash = "message" + email;
        console.log(hash, socketid, "hash 110");
        const user = yield client.user.findUnique({
            where: {
                email: email
            },
            include: {
                contacts: true,
                friendContacts: true
            }
        });
        // //console.log(user?.contacts,"contacts");
        //console.log("socketif");
        if (user) {
            const socket = socket_1.default.getIO();
            const userSocket = socket.sockets.sockets.get(socketid);
            yield (userSocket === null || userSocket === void 0 ? void 0 : userSocket.join(hash));
            console.log(userSocket === null || userSocket === void 0 ? void 0 : userSocket.rooms, "hash 125 sendcontacts");
        }
        const newContactsArray = [...((user === null || user === void 0 ? void 0 : user.contacts) || []), ...((user === null || user === void 0 ? void 0 : user.friendContacts) || [])];
        const contacts = newContactsArray.map(contact => {
            if ((user === null || user === void 0 ? void 0 : user.email) === contact.userId) {
                return { name: contact.friendname, email: contact.friendId };
            }
            else if ((user === null || user === void 0 ? void 0 : user.email) === contact.friendId) {
                return { name: contact.username, email: contact.userId };
            }
        });
        //console.log(contacts);
        res.json(contacts);
    });
}
function setChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try { //console.log(req.body,"setChat");
            const { user, reciever } = req.body;
            if ((!reciever) || (!user)) {
                return res.status(400).json({ message: "Reciever or user not found" });
            }
            const participants = [user, reciever];
            const socketid = req.cookies.socketId;
            const encoder = new TextEncoder();
            const data = encoder.encode(reciever);
            const hash = 'message' + reciever;
            //console.log(hash,"hash");
            const message = yield client.messages.findFirst({
                where: {
                    userArray: {
                        every: {
                            email: {
                                in: participants
                            }
                        }
                    }
                },
                include: {
                    messageContent: true,
                    userArray: true
                }
            });
            //console.log(message);
            const socket = socket_1.default.getIO();
            const userSocket = socket.sockets.sockets.get(socketid);
            console.log(hash, "hash setchat 171");
            userSocket === null || userSocket === void 0 ? void 0 : userSocket.join(hash);
            console.log(userSocket === null || userSocket === void 0 ? void 0 : userSocket.rooms, "rsocketres 174");
            //console.log("userSocket",socketid);
            userSocket === null || userSocket === void 0 ? void 0 : userSocket.to(hash).emit('message', 'room joined');
            res.status(200).json({ messageContent: message === null || message === void 0 ? void 0 : message.messageContent, messageId: message === null || message === void 0 ? void 0 : message.id });
        }
        catch (error) {
            console.log(error);
        }
    });
}
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message, author, friend } = req.body;
        const messageId = req.body.messageId;
        const socketid = req.cookies.socketId;
        const encoder = new TextEncoder();
        const data = encoder.encode(friend);
        const hash = "message" + friend;
        const messageData = yield client.messageContent.create({
            data: {
                content: message,
                authorId: author,
                messageId: messageId
            }
        });
        //console.log(hash,"sendmessage");
        const socket = socket_1.default.getIO();
        const userSocket = socket.sockets.sockets.get(socketid);
        userSocket === null || userSocket === void 0 ? void 0 : userSocket.to(hash).emit('message', { message: messageData.content, author: author });
        const updateMessage = yield client.messages.update({
            where: {
                id: messageId
            },
            data: {
                messageContent: {
                    connect: {
                        id: messageData.id
                    }
                }
            }
        });
        //console.log(updateMessage);
        res.send(message);
    });
}
const messageController = { createChatId, setContacts, setChat, sendMessage, sendContacts };
exports.default = messageController;
//# sourceMappingURL=messages.js.map