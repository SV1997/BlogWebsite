import { Request, Response } from 'express';
import { PrismaClient, user} from '@prisma/client'; // Import the userUpdateInput type
import { get } from 'http';
// import { profile } from '//console';
// import client from '../model/client';
import serverio from '../socket'
import * as crypto from 'crypto';
import { disconnect } from 'process';
// import cookie from 'cookie'
// import cookieParser from 'cookie-parser';
// import { log } from 'console';
const secretKey = crypto.randomBytes(16).toString('hex');
const prisma = new PrismaClient();
const setUserData = async  (req: Request, res: Response) => {
    console.log(req.body,'create user');
    const image= req.body.profileimage?req.body.profileimage:'/uploads/nouserimage.png';
    try {
        const response = await prisma.user.create({
            data: {
            email: req.body.email,
            name: req.body.name,
            profileImage: req.body?.profileimage, // Add the name property
            followers: [req.body.email], // Add the followers property
            }
        });
        req.session.user= {
            email: response!.email,
            name: response!.name,
            profileImage: response!.profileImage ?? '',
            mobileNumber: response!.mobileNumber ?? '',
            status: response!.status ?? ''
        };
        req.session.save()
    res.status(200).json({message:'User data created successfully'})
    } catch (error) {
        console.log(error);
        
    }
}
const editUserData = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const response= await prisma.user.update({
            where:{
                email: req.body.email
            },
            data:{
                email:req.body.email,
                name: req.body.name,
                mobileNumber: req.body.mobilenumber, // Update the property name to phoneNumber
                profileImage: req?.file?.path, // Add the profileImage property
                status: req.body.status // Add the status property
            }
        }) 
        res.status(200).json(response)       
    } catch (error) {
        console.log(error);
        
    }
} 

const getUserData = async (req: Request, res: Response) => {
    const email=req.body.email;
    //console.log(email, req.session.user?.email);
    let requestSent:Boolean=false;
    let requestRecieved:Boolean=false;
    let followed:Boolean=false;
    let following:Boolean=false;
    const partial= req.body.partial;
    let response: user| null =null;
    console.log(req.cookies,"cookies");
    
    // req.cookies.email = email;
    try{
        response= await prisma.user.findUnique({
            where:{
                email:email
            }
        })
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
        if(req.cookies.email!==email){
            requestSent = response?.requestRecieved?.includes(req.cookies.email) ?? false;
            requestRecieved = response?.requestSend?.includes(req.cookies.email) ?? false;
            followed= response?.followers?.includes(req.cookies.email) ?? false;
            following= response?.following?.includes(req.cookies.email) ?? false;
        }
        //console.log(req.user)
        // const session= req.session.save((err) => {
        //     //console.log("session saved");
        //     if (err) {
        //         //console.log(err);
        //     }

        // })
                
    }
    catch(error){
        return res.json({message:'User not found'});
        //console.log(error);
    }
    
    //console.log(response);
    if(partial){
        // res.cookie('email', email,{httpOnly:true,secure:true});
        return res.status(200).json({name:response?.name, email:response?.email, profileImage:response?.profileImage, status:response?.status,requestRecieved:requestRecieved,requestSent:requestSent, followed:followed, following:following});
    }
    
    res.cookie('email', email,{httpOnly:true,secure:true, sameSite:'none'});
    return res.status(200).json(response);
}
// :Promise<Response<JSON, Record<string, any>>>
const searchUser=async (req: Request, res: Response)=>{
    //console.log(req.params.q,'search user');
    //console.log(req.session);
    
    const query=req.params.q;
    let response: user[]|null=null;
    if(query.length<1){
        return res.status(400).json({message:'Invalid search query'});
    }
    try {
        response= await prisma.user.findMany({
            where:{
                name:{
                    contains:query,
                    mode:'insensitive'
                }
            }
        })
        //console.log(response);
        
        return res.status(200).json(response.map(user => ({ name: user.name, email: user.email, profileImage: user.profileImage })));
    } catch (error) {
        //console.log(error);
        
    }
    return res.status(500).json({message: 'Internal server error'});
}

const sendRequest = async (req: Request, res: Response) => {
    // const user= client.get(options, key)
    console.log("request sent");
    const socketId: string = req.body.socketId;
    // Usage example 
    const email: any  = req.cookies.email
    //console.log(email,email2);
    // //console.log(req.session);
    
    const friendEmail = req.body.email;
    let response: user | null = null;
    let responseFriend: user | null = null;
    try {
        if(email!==undefined){
           const firnedRequests= await prisma.user.findUnique({
                where: {
                    email: friendEmail
                }
            })
         const   requests= firnedRequests?.requestRecieved;
        const answer= requests?.includes(email);
        if(answer){
            console.log('Request already sent');
            
            return res.status(400).json({message:'Request already sent'});
        }
        response = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                requestSend: {
                    push: friendEmail
                }
            }
        })
    }
        responseFriend = await prisma.user.update({
            where: {
                email: friendEmail
            },
            data: {
                requestRecieved: {
                    push: email
                }
            }
    })
    // const sockets=await prisma.socket.findUnique({
    //     where:{
    //         userId:friendEmail
    //     }
    // })
    // const socketId: string|undefined=sockets?.socketId;
    const io = serverio.getIO();
    const socket=io.sockets.sockets.get(socketId!);
    socket?.join(friendEmail);
    socket?.to(friendEmail).emit('notificationUpdate', { email:email, message: 'New friend request' });

    res.status(200).json({ message: 'Request sent successfully' });

    } catch (error) {
        console.log(error);
    }
}
interface followerData{
    email: string,
    name: string,
    profileImage: string
}
const followRequests = async (req: Request, res: Response) => {
    const email: string = req.cookies.email || '';
    console.log(email,req.cookies,"followRequests");
    
    let response: user | null = null;
    
    try {
        response = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        console.log(response,"followRequests");
        
        const followRequests: string[]| undefined= response?.requestRecieved;
        const followRequestsData: user[] = await prisma.user.findMany({
            where: {
                email: {
                    in: followRequests || []
                }
            }
        })
        const followerData: followerData[]= followRequestsData.map((user)=>{
            return {email:user.email, name:user.name, profileImage:user.profileImage!}
        })
        console.log(followerData);
        
        res.status(200).json(followerData);
    } catch (error) {
        console.log(error);
    }
}

const acceptRequest = async (req: Request, res: Response) => {
    try {
        const email: string | undefined = req.cookies.email;
        const friendEmail = req.body.email;
        const response: user | null = await prisma.user.update({
            where: {
                email: email
            },
            data:{
                followers:{
                    push: friendEmail
                }
            }
            }
        )
        res.status(200).json({ accepted:true, message: 'Request accepted successfully' });
    } catch (error) {
        //console.log(error);
    }
}
const rejectRequest = async (req: Request, res: Response) => {
    try {
        const email: string | undefined = req.cookies.email;
        const friendEmail = req.body.email;
        const response: user | null = await prisma.user.findUnique({
            where: {
            email: email
            },
        })
        const newArr= response?.requestRecieved?.filter((request)=> request!==friendEmail);
        const updatedResponse: user | null = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                requestRecieved: newArr
            }
        })
        res.status(200).json({ message: 'Request rejected successfully'})
    } catch (error) {
        //console.log(error);
    }
}
const confirmRequest = async (req: Request, res: Response) => {
try {
    console.log("confirmed");
    console.log(req.cookies);
    
    const email: string= req.cookies.email;
    const friendEmail: string= req.body.email;
    const user= await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    const isPresent: boolean|undefined= user?.followers?.includes(friendEmail);
    console.log(isPresent,"find", user?.followers, user?.email);
    
    if(isPresent){
        return res.status(400).json({message:'user present in follower list'});
    }

    const userFollower: string[] = user?.followers ?? [];
    userFollower.push(friendEmail);
    const requestRecieved= user?.requestRecieved.filter((request)=> request!==friendEmail);
        const userupdated= await prisma.user.update({
        where:{
            email:email
        },
        data:{
            requestRecieved:requestRecieved,
            followers:userFollower
        }
    })
    console.log(userupdated);
    
    const userFriend= await prisma.user.findUnique({
        where:{
            email:friendEmail
        },
    })
    userFriend?.following.push(email);
    const requestSend=userFriend?.requestSend.filter((request)=> request!==email);
    const userFriendUpdated= await prisma.user.update({
        where:{
            email:friendEmail
        },
        data:{
            requestSend:requestSend,
            following:userFriend?.following
        }
    })
    console.log(userFriendUpdated);
    
} catch (error) {
    console.log(error);
    
    return res.status(500).json({message:'Internal server error'});
}
}

const logout= async (req: Request, res: Response) => {
try {
    // req.session.destroy((err) => {
    //     console.log(err)
    // })
    console.log(req.cookies.email, req.cookies.socketId);
    
    res.clearCookie('email',{ httpOnly: true,  // Same as when the cookie was set
        secure: true,    // Same as when the cookie was set
        sameSite: 'none' });
    res.clearCookie('socketId',{ httpOnly: true,  // Same as when the cookie was set
        secure: true,    // Same as when the cookie was set
        sameSite: 'none' });
    console.log(req.cookies.email, req.cookies.socketId);
    const socket = serverio.getIO().sockets.sockets.get(req.cookies.socketId);
    if(socket){
        socket.emit("disconnect","disconnected")
        socket.disconnect(true);
    }
    console.log(req.session);
    
    res.status(200).json({message:'Logged out successfully'})
} catch (error) {
    console.log(error);
    
}
}
const postWindowLeave= async (req: Request, res: Response) => {
    try{
        console.log("unload", req.cookies.email);
        
const socketId: string= req.body.socketId;
// const deletedSocket= await prisma.socket.delete({
//     where:{
//         userId:req.cookies.email
//     }
// })
// console.log(deletedSocket);

    }
    catch(error){
        console.log(error);
        
    }
}

const withdrawrequest= async (req: Request, res: Response) => {
try {
    const email: string= req.cookies.email;
    const friendEmail: string= req.body.email;
    const user= await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    const requestSend= user?.requestSend.filter((request)=> request!==friendEmail);
    const userupdated= await prisma.user.update({
        where:{
            email:email
        },
        data:{
            requestSend:requestSend
        }
    })
    console.log(userupdated);
    
    const userFriend= await prisma.user.findUnique({
        where:{
            email:friendEmail
        },
    })
    const requestRecieved= userFriend?.requestRecieved.filter((request)=>{return request!==email});
    const userFriendUpdated= await prisma.user.update({
        where:{
            email:friendEmail
        },
        data:{
            requestRecieved:requestRecieved
        }
        }
    )
    console.log(userFriendUpdated);
    
} catch (error) {
    console.log(error);
    
}
}

const unfollow= async (req: Request, res: Response) => {
    try {
        const friendEmail: string= req.body.email;
        const email= req.cookies.email;
        const user= await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        const requestSend= user?.following.filter((following)=> following!==friendEmail);
        const userupdated= await prisma.user.update({
            where:{
                email:email
            },
            data:{
                requestSend:requestSend
            }
        })
        console.log(userupdated);
        
        const userFriend= await prisma.user.findUnique({
            where:{
                email:friendEmail
            },
        })
        const requestRecieved= userFriend?.followers.filter((follower)=>{return follower!==email});
        const userFriendUpdated= await prisma.user.update({
            where:{
                email:friendEmail
            },
            data:{
                requestRecieved:requestRecieved
            }
            }
        )
        console.log(userFriendUpdated); 
        
    } catch (error) {
        console.log(error);
        
    }
}

const user = {setUserData,editUserData,getUserData, searchUser, sendRequest, followRequests, acceptRequest, rejectRequest, confirmRequest,logout, postWindowLeave, withdrawrequest, unfollow};

export default user;