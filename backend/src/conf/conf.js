const dotenv = require('dotenv');

dotenv.config();
export default {
    password: import.meta.env.REDIS_PASSWORD,
    host: import.meta.env.REDIS_HOST,
    port: import.meta.env. REDIS_PORT
}