import express from 'express';
import user from '../controller/user';
import { Request,Response } from 'express';
const app = express();
const userRouter = express.Router();

userRouter.post('/edituserdata',user.editUserData);
userRouter.post('/userdata', user.setUserData);
userRouter.post('/getuserdata', user.getUserData);
userRouter.get('/search/:q', user.searchUser);
userRouter.post('/sendrequest',user.sendRequest);
userRouter.post('/confirmrequest',user.confirmRequest);
userRouter.post('/logout',user.logout);
userRouter.post('/followerequests',user.followRequests);
userRouter.post('/windowleave',user.postWindowLeave);
userRouter.post('/withdrawrequest',user.withdrawrequest);
userRouter.post('/unfollow',user.unfollow);
export { userRouter };