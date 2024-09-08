"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controller/user"));
const app = (0, express_1.default)();
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post('/edituserdata', user_1.default.editUserData);
userRouter.post('/userdata', user_1.default.setUserData);
userRouter.post('/getuserdata', user_1.default.getUserData);
userRouter.get('/search/:q', user_1.default.searchUser);
userRouter.post('/sendrequest', user_1.default.sendRequest);
userRouter.post('/confirmrequest', user_1.default.confirmRequest);
userRouter.post('/logout', user_1.default.logout);
userRouter.post('/followerequests', user_1.default.followRequests);
userRouter.post('/windowleave', user_1.default.postWindowLeave);
userRouter.post('/withdrawrequest', user_1.default.withdrawrequest);
userRouter.post('/unfollow', user_1.default.unfollow);
//# sourceMappingURL=user.js.map