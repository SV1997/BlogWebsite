"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = __importDefault(require("express"));
const messages_1 = __importDefault(require("../controller/messages"));
const app = (0, express_1.default)();
const messageRouter = express_1.default.Router();
exports.messageRouter = messageRouter;
messageRouter.post('/createChatId', messages_1.default.createChatId);
messageRouter.get('/getcontacts', messages_1.default.sendContacts);
messageRouter.post('/setcontacts', messages_1.default.setContacts);
messageRouter.post('/sendmessage', messages_1.default.sendMessage);
messageRouter.post('/getmessages', messages_1.default.setChat);
//# sourceMappingURL=messages.js.map