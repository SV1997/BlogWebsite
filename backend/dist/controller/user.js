"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// import { profile } from '//console';
// import client from '../model/client';
const socket_1 = __importDefault(require("../socket"));
const crypto = __importStar(require("crypto"));
// import cookie from 'cookie'
// import cookieParser from 'cookie-parser';
// import { log } from 'console';
const secretKey = crypto.randomBytes(16).toString('hex');
const prisma = new client_1.PrismaClient();
const setUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log(req.body, 'create user');
    const image = req.body.profileimage ? req.body.profileimage : '/uploads/nouserimage.png';
    try {
        const response = yield prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                profileImage: (_a = req.body) === null || _a === void 0 ? void 0 : _a.profileimage, // Add the name property
                followers: [req.body.email], // Add the followers property
            }
        });
        req.session.user = {
            email: response.email,
            name: response.name,
            profileImage: (_b = response.profileImage) !== null && _b !== void 0 ? _b : '',
            mobileNumber: (_c = response.mobileNumber) !== null && _c !== void 0 ? _c : '',
            status: (_d = response.status) !== null && _d !== void 0 ? _d : ''
        };
        req.session.save();
        res.status(200).json({ message: 'User data created successfully' });
    }
    catch (error) {
        console.log(error);
    }
});
const editUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.body);
        const response = yield prisma.user.update({
            where: {
                email: req.body.email
            },
            data: {
                email: req.body.email,
                name: req.body.name,
                mobileNumber: req.body.mobilenumber, // Update the property name to phoneNumber
                profileImage: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path, // Add the profileImage property
                status: req.body.status // Add the status property
            }
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
    }
});
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const email = req.body.email;
    //console.log(email, req.session.user?.email);
    let requestSent = false;
    let requestRecieved = false;
    let followed = false;
    let following = false;
    const partial = req.body.partial;
    let response = null;
    console.log(req.cookies, "cookies");
    // req.cookies.email = email;
    try {
        response = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        //console.log(req.user,req.session.user,'session');
        // req.session.user = {
        //     email: response!.email,
        //     name: response!.name,
        //     profileImage: response!.profileImage ?? '',
        //     mobileNumber: response!.mobileNumber ?? '',
        //     status: response!.status ?? ''
        // };
        // req.user= {
        //     ...req.user,
        //     email: response!.email,
        //     name: response!.name,
        //     profileImage: response!.profileImage ?? '',
        //     mobileNumber: response!.mobileNumber ?? '',
        //     status: response!.status ?? ''
        // };
        if (req.cookies.email !== email) {
            requestSent = (_b = (_a = response === null || response === void 0 ? void 0 : response.requestRecieved) === null || _a === void 0 ? void 0 : _a.includes(req.cookies.email)) !== null && _b !== void 0 ? _b : false;
            requestRecieved = (_d = (_c = response === null || response === void 0 ? void 0 : response.requestSend) === null || _c === void 0 ? void 0 : _c.includes(req.cookies.email)) !== null && _d !== void 0 ? _d : false;
            followed = (_f = (_e = response === null || response === void 0 ? void 0 : response.followers) === null || _e === void 0 ? void 0 : _e.includes(req.cookies.email)) !== null && _f !== void 0 ? _f : false;
            following = (_h = (_g = response === null || response === void 0 ? void 0 : response.following) === null || _g === void 0 ? void 0 : _g.includes(req.cookies.email)) !== null && _h !== void 0 ? _h : false;
        }
        //console.log(req.user)
        // const session= req.session.save((err) => {
        //     //console.log("session saved");
        //     if (err) {
        //         //console.log(err);
        //     }
        // })
    }
    catch (error) {
        return res.json({ message: 'User not found' });
        //console.log(error);
    }
    //console.log(response);
    if (partial) {
        // res.cookie('email', email,{httpOnly:true,secure:true});
        return res.status(200).json({ name: response === null || response === void 0 ? void 0 : response.name, email: response === null || response === void 0 ? void 0 : response.email, profileImage: response === null || response === void 0 ? void 0 : response.profileImage, status: response === null || response === void 0 ? void 0 : response.status, requestRecieved: requestRecieved, requestSent: requestSent, followed: followed, following: following });
    }
    res.cookie('email', email, { httpOnly: true, secure: true });
    return res.status(200).json(response);
});
// :Promise<Response<JSON, Record<string, any>>>
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(req.params.q,'search user');
    //console.log(req.session);
    const query = req.params.q;
    let response = null;
    if (query.length < 1) {
        return res.status(400).json({ message: 'Invalid search query' });
    }
    try {
        response = yield prisma.user.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            }
        });
        //console.log(response);
        return res.status(200).json(response.map(user => ({ name: user.name, email: user.email, profileImage: user.profileImage })));
    }
    catch (error) {
        //console.log(error);
    }
    return res.status(500).json({ message: 'Internal server error' });
});
const sendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const user= client.get(options, key)
    console.log("request sent");
    const socketId = req.body.socketId;
    // Usage example 
    const email = req.cookies.email;
    //console.log(email,email2);
    // //console.log(req.session);
    const friendEmail = req.body.email;
    let response = null;
    let responseFriend = null;
    try {
        if (email !== undefined) {
            const firnedRequests = yield prisma.user.findUnique({
                where: {
                    email: friendEmail
                }
            });
            const requests = firnedRequests === null || firnedRequests === void 0 ? void 0 : firnedRequests.requestRecieved;
            const answer = requests === null || requests === void 0 ? void 0 : requests.includes(email);
            if (answer) {
                console.log('Request already sent');
                return res.status(400).json({ message: 'Request already sent' });
            }
            response = yield prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    requestSend: {
                        push: friendEmail
                    }
                }
            });
        }
        responseFriend = yield prisma.user.update({
            where: {
                email: friendEmail
            },
            data: {
                requestRecieved: {
                    push: email
                }
            }
        });
        // const sockets=await prisma.socket.findUnique({
        //     where:{
        //         userId:friendEmail
        //     }
        // })
        // const socketId: string|undefined=sockets?.socketId;
        const io = socket_1.default.getIO();
        const socket = io.sockets.sockets.get(socketId);
        socket === null || socket === void 0 ? void 0 : socket.join(friendEmail);
        socket === null || socket === void 0 ? void 0 : socket.to(friendEmail).emit('notificationUpdate', { email: email, message: 'New friend request' });
        res.status(200).json({ message: 'Request sent successfully' });
    }
    catch (error) {
        console.log(error);
    }
});
const followRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.cookies.email || '';
    console.log(email, req.cookies, "followRequests");
    let response = null;
    try {
        response = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        console.log(response, "followRequests");
        const followRequests = response === null || response === void 0 ? void 0 : response.requestRecieved;
        const followRequestsData = yield prisma.user.findMany({
            where: {
                email: {
                    in: followRequests || []
                }
            }
        });
        const followerData = followRequestsData.map((user) => {
            return { email: user.email, name: user.name, profileImage: user.profileImage };
        });
        console.log(followerData);
        res.status(200).json(followerData);
    }
    catch (error) {
        console.log(error);
    }
});
const acceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.cookies.email;
        const friendEmail = req.body.email;
        const response = yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                followers: {
                    push: friendEmail
                }
            }
        });
        res.status(200).json({ accepted: true, message: 'Request accepted successfully' });
    }
    catch (error) {
        //console.log(error);
    }
});
const rejectRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = req.cookies.email;
        const friendEmail = req.body.email;
        const response = yield prisma.user.findUnique({
            where: {
                email: email
            },
        });
        const newArr = (_a = response === null || response === void 0 ? void 0 : response.requestRecieved) === null || _a === void 0 ? void 0 : _a.filter((request) => request !== friendEmail);
        const updatedResponse = yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                requestRecieved: newArr
            }
        });
        res.status(200).json({ message: 'Request rejected successfully' });
    }
    catch (error) {
        //console.log(error);
    }
});
const confirmRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("confirmed");
        console.log(req.cookies);
        const email = req.cookies.email;
        const friendEmail = req.body.email;
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        const isPresent = (_a = user === null || user === void 0 ? void 0 : user.followers) === null || _a === void 0 ? void 0 : _a.includes(friendEmail);
        console.log(isPresent, "find", user === null || user === void 0 ? void 0 : user.followers, user === null || user === void 0 ? void 0 : user.email);
        if (isPresent) {
            return res.status(400).json({ message: 'user present in follower list' });
        }
        const userFollower = (_b = user === null || user === void 0 ? void 0 : user.followers) !== null && _b !== void 0 ? _b : [];
        userFollower.push(friendEmail);
        const requestRecieved = user === null || user === void 0 ? void 0 : user.requestRecieved.filter((request) => request !== friendEmail);
        const userupdated = yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                requestRecieved: requestRecieved,
                followers: userFollower
            }
        });
        console.log(userupdated);
        const userFriend = yield prisma.user.findUnique({
            where: {
                email: friendEmail
            },
        });
        userFriend === null || userFriend === void 0 ? void 0 : userFriend.following.push(email);
        const requestSend = userFriend === null || userFriend === void 0 ? void 0 : userFriend.requestSend.filter((request) => request !== email);
        const userFriendUpdated = yield prisma.user.update({
            where: {
                email: friendEmail
            },
            data: {
                requestSend: requestSend,
                following: userFriend === null || userFriend === void 0 ? void 0 : userFriend.following
            }
        });
        console.log(userFriendUpdated);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // req.session.destroy((err) => {
        //     console.log(err)
        // })
        res.clearCookie('email');
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.log(error);
    }
});
const postWindowLeave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("unload", req.cookies.email);
        const socketId = req.body.socketId;
        // const deletedSocket= await prisma.socket.delete({
        //     where:{
        //         userId:req.cookies.email
        //     }
        // })
        // console.log(deletedSocket);
    }
    catch (error) {
        console.log(error);
    }
});
const withdrawrequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.cookies.email;
        const friendEmail = req.body.email;
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        const requestSend = user === null || user === void 0 ? void 0 : user.requestSend.filter((request) => request !== friendEmail);
        const userupdated = yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                requestSend: requestSend
            }
        });
        console.log(userupdated);
        const userFriend = yield prisma.user.findUnique({
            where: {
                email: friendEmail
            },
        });
        const requestRecieved = userFriend === null || userFriend === void 0 ? void 0 : userFriend.requestRecieved.filter((request) => { return request !== email; });
        const userFriendUpdated = yield prisma.user.update({
            where: {
                email: friendEmail
            },
            data: {
                requestRecieved: requestRecieved
            }
        });
        console.log(userFriendUpdated);
    }
    catch (error) {
        console.log(error);
    }
});
const unfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const friendEmail = req.body.email;
        const email = req.cookies.email;
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        const requestSend = user === null || user === void 0 ? void 0 : user.following.filter((following) => following !== friendEmail);
        const userupdated = yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                requestSend: requestSend
            }
        });
        console.log(userupdated);
        const userFriend = yield prisma.user.findUnique({
            where: {
                email: friendEmail
            },
        });
        const requestRecieved = userFriend === null || userFriend === void 0 ? void 0 : userFriend.followers.filter((follower) => { return follower !== email; });
        const userFriendUpdated = yield prisma.user.update({
            where: {
                email: friendEmail
            },
            data: {
                requestRecieved: requestRecieved
            }
        });
        console.log(userFriendUpdated);
    }
    catch (error) {
        console.log(error);
    }
});
const user = { setUserData, editUserData, getUserData, searchUser, sendRequest, followRequests, acceptRequest, rejectRequest, confirmRequest, logout, postWindowLeave, withdrawrequest, unfollow };
exports.default = user;
//# sourceMappingURL=user.js.map