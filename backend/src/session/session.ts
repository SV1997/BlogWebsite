import { Store, SessionData } from 'express-session';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

class SessionStore extends Store {
    constructor() {
        super();
    }

    async get(sid: string, callback: (err: any, session?: SessionData | null | undefined) => void) {
        try {
            const session = await prisma.session.findUnique({
                where: { sid }
            });
            if (session) {
                callback(null, JSON.parse(session.data));
            } else {
                callback(null, null);
            }
        } catch (error) {
            callback(error);
        }
    }

    async set(sid: string, session: SessionData, callback: (err?: any) => void) {
        try {
            await prisma.session.upsert({
                where: { sid },
                update: {
                    data: JSON.stringify(session),
                    expiresAt: new Date(Date.now() + (session.cookie.maxAge ?? 0))
                },
                create: {
                    sid,
                    data: JSON.stringify(session),
                    expiresAt: new Date(Date.now() + (session.cookie.maxAge ?? 0))
                }
            });
            if (callback) {
                callback(null);
            }
        } catch (error) {
            callback(error);
        }
    }

    async destroy(sid: string, callback?: (err?: any) => void) {
        try {
            await prisma.session.delete({
                where: { sid }
            });
            if (callback) {
                callback(null);
            }
        } catch (error) {
            if (callback) {
                callback(null);
            }
        }
    }

    generate(req: Express.Request) {
        req.sessionID = uuidv4();
        console.log(`Generated new session ID: ${req.sessionID}`);
    }
}

export default SessionStore;
