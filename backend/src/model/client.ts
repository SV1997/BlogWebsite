// import { createClient } from 'redis'
// import * as dotenv from 'dotenv';
// dotenv.config();
// const client = createClient({
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: Number(process.env.REDIS_PORT),
//     },
    
// });
// console.log({password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: Number(process.env.REDIS_PORT),
//     },});

// client.on('error', (err) => console.log('Redis Client Error', err));
// client.on('connect', () => console.log('Connected to Redis'));

// // Initialize the connection
// (async () => {
//     await client.connect();
// })();

// export default client;