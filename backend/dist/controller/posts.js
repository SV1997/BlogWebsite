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
const prisma = new client_1.PrismaClient();
const newPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 'create');
    const now = new Date(Date.now());
    let day = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear() % 100;
    let hours = now.getHours();
    let minutes = now.getMinutes();
    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;
    year = year < 10 ? `0${year}` : year;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const date = `${day}/${month}/${year} ${hours}:${minutes}`;
    try {
        const response = yield prisma.post.create({
            data: {
                content: req.body.post,
                GIF: req.body.gif,
                published: String(date),
                location: req.body.location,
                Image: req.body.image,
                videoUrl: req.body.videoUrl,
                author: {
                    connect: {
                        email: req.body.author
                    }
                },
            }
        });
        console.log(response);
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
    }
});
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    console.log(email, 'getposts');
    const socketId = req.body.socketId;
    console.log(socketId);
    let response = null;
    try {
        const io = socket_1.default.getIO();
        const socket = io.sockets.sockets.get(socketId);
        socket === null || socket === void 0 ? void 0 : socket.on('connect', () => {
            // Handle the 'connect' event
        });
        const allSockets = Array.from(io.sockets.sockets.keys());
        console.log(allSockets, "all sockets");
        if (email) {
            socket === null || socket === void 0 ? void 0 : socket.join(email);
        }
        // const socketSave=await prisma.socket.create({
        //     data:{
        //         socketId: socketId,
        //         userId: (email as string),
        //     }
        // })
        response = yield prisma.user.findUnique({
            where: {
                email: String(email)
            }
        });
        // res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
    }
    const followers = response === null || response === void 0 ? void 0 : response.followers;
    try {
        let allposts = [];
        const response = yield prisma.post.findMany({
            where: {
                authorId: {
                    in: followers || []
                }
            },
            include: {
                likes: true
            }
        });
        const authorIds = Array.from(new Set(response.map(post => post.authorId)));
        const authors = yield prisma.user.findMany({
            where: {
                email: {
                    in: authorIds
                }
            }
        });
        const authorMap = authors.reduce((map, author) => {
            map[author.email] = author;
            return map;
        }, {});
        allposts = response.map((post) => {
            const author = authorMap[post.authorId];
            return Object.assign(Object.assign({}, post), { profile: author.profileImage, author: author.name, email: author.email });
        });
        console.log(allposts, "allposts", socketId);
        res.cookie('socketId', socketId, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.status(200).json(allposts);
    }
    catch (error) {
        console.log(error);
    }
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getallposts');
    let response = null;
    let allposts = []; // Initialize the 'allposts' variable
    try {
        response = yield prisma.post.findMany();
        // // console.log(response);
        const authorIds = Array.from(new Set(response.map(post => post.authorId)));
        const authors = yield prisma.user.findMany({
            where: {
                email: {
                    in: authorIds
                }
            }
        });
        const authorMap = authors.reduce((map, author) => {
            map[author.email] = author;
            return map;
        }, {});
        allposts = response.map((post) => {
            const author = authorMap[post.authorId];
            return Object.assign(Object.assign({}, post), { profile: author.profileImage, author: author.name, email: author.email });
        });
        console.log(allposts);
        return res.status(200).json(allposts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const addLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.body, 'addlikes');
    try {
        const id = Number(req.body.id);
        const liker = req.body.liker;
        console.log(id, liker);
        const user = yield prisma.user.findUnique({
            where: {
                email: String(liker)
            }
        });
        console.log(user);
        const post = yield prisma.post.findUnique({
            where: {
                id: id
            },
            include: {
                likes: true
            }
        });
        console.log(post);
        const likesArray = post === null || post === void 0 ? void 0 : post.likes;
        const isPresent = likesArray === null || likesArray === void 0 ? void 0 : likesArray.some(like => like.userId === liker);
        console.log(isPresent);
        if (isPresent) {
            return res.status(200).json({ msg: 'Already liked' });
        }
        const like = yield prisma.likes.create({
            data: {
                user: {
                    connect: {
                        email: String(liker)
                    }
                },
                post: {
                    connect: {
                        id: id
                    }
                }
            }
        });
        const updatePosts = yield prisma.post.update({
            where: {
                id: id
            },
            data: {
                likeNumber: {
                    increment: 1
                }
            }
        });
        console.log(updatePosts);
        const likes = ((_a = likesArray === null || likesArray === void 0 ? void 0 : likesArray.length) !== null && _a !== void 0 ? _a : 0) + 1;
        return res.status(200).json({ likes: likes, msg: "Likes added successfully" });
    }
    catch (error) {
        console.log(error);
    }
});
const addComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 'addcomments');
    try {
        const comment = yield prisma.comment.create({
            data: {
                content: req.body.comment,
                postId: req.body.postId,
                authorId: req.body.authorId,
                published: String(req.body.published)
            }
        });
        console.log(comment);
        const postComment = yield prisma.post.update({
            where: {
                id: Number(req.body.postId)
            },
            data: {
                comments: {
                    connect: { id: comment.id }
                }
            },
            include: {
                comments: true
            }
        });
        console.log(postComment);
        res.status(200).json(postComment);
    }
    catch (error) {
        console.log(error);
    }
});
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 'getcomments');
    try {
        const postComments = yield prisma.post.findUnique({
            where: {
                id: Number(req.body.postId)
            },
        }).comments();
        console.log(postComments);
        let authorIds;
        if (postComments) {
            authorIds = Array.from(new Set(postComments.map(comment => comment.authorId)));
            const authors = yield prisma.user.findMany({
                where: {
                    email: {
                        in: authorIds
                    }
                }
            });
            const authorMap = authors.reduce((map, author) => {
                map[author.email] = author;
                return map;
            }, {});
            console.log(authorMap);
            const commentsMap = postComments.map((comment) => {
                const author = authorMap[comment.authorId];
                return Object.assign(Object.assign({}, comment), { profile: 'https://shark-app-ahkas.ondigitalocean.app/' + author.profileImage, author: author.name, email: author.email });
            });
            return res.status(200).json(commentsMap);
        }
        else {
            return res.status(200).json({ msg: 'no comments present' });
        }
    }
    catch (error) {
        console.log(error);
    }
});
const posts = { newPost, getPosts, getAllPosts, addLikes, addComments, getComments };
exports.default = posts;
//# sourceMappingURL=posts.js.map