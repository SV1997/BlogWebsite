import express from 'express';
import cors from 'cors';
import session from 'express-session';
import RedisStore from 'connect-redis';
// import client from './model/client';
import multer from 'multer';
import { userRouter } from './routes/user';
import { postRouter } from './routes/posts';
import path from 'path';
import { Request,Response, NextFunction } from 'express';
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
app.options('https://blog-website-seven-ecru.vercel.app', cors());  // Include before your other routes

app.use(cors({
    origin: 'https://blog-website-seven-ecru.vercel.app', // This should be the URL of your frontend
    credentials: true, // To allow cookies to be shared between backend and frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowable methods
    allowedHeaders: ['Content-Type', 'Authorization'],
})); 
app.use((req:Request, res:Response, next:NextFunction) => {
    res.header('Access-Control-Allow-Origin', 'https://blog-website-seven-ecru.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // To respond to preflight requests
    }
    next();
})
app.use((req:Request, res:Response, next:NextFunction) => {
    console.log('Received request from:', req.headers.origin);
    next();
});

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
