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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import client from './model/client';
const multer_1 = __importDefault(require("multer"));
const user_1 = require("./routes/user");
const posts_1 = require("./routes/posts");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./socket"));
const crypto = __importStar(require("crypto"));
const messages_1 = require("./routes/messages");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const secretKey = crypto.randomBytes(16).toString('hex');
app.use((0, cookie_parser_1.default)(secretKey));
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
app.options('https://blog-website-p12mz2hi5-saharsh-vahsishthas-projects.vercel.app', (0, cors_1.default)()); // Include before your other routes
app.use((0, cors_1.default)({
    origin: 'https://blog-website-p12mz2hi5-saharsh-vahsishthas-projects.vercel.app', // This should be the URL of your frontend
    credentials: true, // To allow cookies to be shared between backend and frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowable methods
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://blog-website-p12mz2hi5-saharsh-vahsishthas-projects.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // To respond to preflight requests
    }
    next();
});
app.use((req, res, next) => {
    console.log('Received request from:', req.headers.origin);
    next();
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Ensure this is before the routes
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use((0, multer_1.default)({
    storage: multer_1.default.diskStorage({
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
        }
        else {
            cb(null, false);
        }
    }
}).single('profileImage'));
// app.use((req: Request, res: Response, next: NextFunction) => {
//     req.user = req.session.user as { email: string; name: string; profileImage: string; mobileNumber: string; status: string; };
//     next()
// });
// Routers
app.use('/api/v1/user', user_1.userRouter);
app.use('/api/v1/posts', posts_1.postRouter);
app.use('/api/v1/messages', messages_1.messageRouter);
const io = socket_1.default.init(server);
io.on('connection', (socket) => {
    console.log('Client connected with socket id:', socket.id);
    socket.emit('socketId', socket.id);
});
console.log("here i am");
server.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=index.js.map