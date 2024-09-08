import express from 'express';
import messageController from '../controller/messages';
import { Request,Response } from 'express';
const app = express();
const messageRouter = express.Router();

messageRouter.post('/createChatId',messageController.createChatId);
messageRouter.get('/getcontacts',messageController.sendContacts);
messageRouter.post('/setcontacts',messageController.setContacts);
messageRouter.post('/sendmessage',messageController.sendMessage);
messageRouter.post('/getmessages',messageController.setChat);

export { messageRouter };