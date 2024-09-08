import * as Express from "express";
import {SessionData, Session} from "express-session";

declare module 'express-session' {
  export  interface SessionData {
      user: {
         email: string,
         name: string,
         profileImage: string,
         mobileNumber: string,
         status: string
   };
    }
  }


  declare global {
     namespace Express {
     interface Request {
          user: {
               email: string,
               name: string,
               profileImage: string,
               mobileNumber: string,
               status: string
         };
       }
     }
   }
        

  export {}