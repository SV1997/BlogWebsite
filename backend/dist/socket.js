"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
let io;
const server = {
    init: (server) => {
        io = new socket_io_1.Server(server, {
            cors: {
                origin: 'https://blog-website-c2rt6u6ig-saharsh-vahsishthas-projects.vercel.app',
                methods: ["GET", "POST"],
                allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token", "Access-Control-Allow-Origin"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
};
exports.default = server;
//# sourceMappingURL=socket.js.map