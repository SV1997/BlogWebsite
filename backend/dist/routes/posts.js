"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("../controller/posts"));
const app = (0, express_1.default)();
const postRouter = express_1.default.Router();
exports.postRouter = postRouter;
postRouter.post('/newpost', posts_1.default.newPost);
postRouter.post('/getposts', posts_1.default.getPosts);
postRouter.get('/getallposts', posts_1.default.getAllPosts);
postRouter.post('/addlikes', posts_1.default.addLikes);
postRouter.post('/addcomments', posts_1.default.addComments);
postRouter.post('/getcomments', posts_1.default.getComments);
//# sourceMappingURL=posts.js.map