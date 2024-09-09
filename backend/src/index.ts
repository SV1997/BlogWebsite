import express from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
// import client from './model/client';
import multer from 'multer';
import { userRouter } from './routes/user';
import { postRouter } from './routes/posts';
import path from 'path';
import { Request,Response } from 'express';
import { NextFunction } from 'connect';
import cookieParser from 'cookie-parser';
import http from 'http';
import serverio from './socket'
import * as crypto from 'crypto';
import { messageRouter } from './routes/messages';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
const server=http.createServer(app)
const secretKey = crypto.randomBytes(16).toString('hex');
app.use(cookieParser(secretKey));
// Session Configuration
// const redisstoreInstance = new RedisStore({ client: client });
// const sessionMiddleware= session({
//     secret: 'my secret',
//     resave: false,
//     saveUninitialized: true,
//     store: redisstoreInstance
//   })
//   app.use(
//     sessionMiddleware,
//   );

// Middleware Setup
app.use(cors({
    origin: 'https://blog-website-seven-ecru.vercel.app',
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token", "Set-Cookie","Cookie","Origin"],
    credentials: true // Important to allow cookies to be sent
})); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 // Ensure this is before the routes

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}).single('profileImage'));
// app.use((req: Request, res: Response, next: NextFunction) => {
//     req.user = req.session.user as { email: string; name: string; profileImage: string; mobileNumber: string; status: string; };
//     next()
// });
// Routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/messages', messageRouter);
const io= serverio.init(server)
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('socketId', socket.id);

})

server.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});
