import express from 'express';
import post from '../controller/posts';

const app = express();
const postRouter = express.Router();
postRouter.post('/newpost', post.newPost);
postRouter.post('/getposts', post.getPosts);
postRouter.get('/getallposts', post.getAllPosts);
postRouter.post('/addlikes', post.addLikes);
postRouter.post('/addcomments', post.addComments);
postRouter.post('/getcomments', post.getComments);
export { postRouter };