import { Request, Response } from 'express';
import { PrismaClient, Post,user, comment} from '@prisma/client'; // Import the userUpdateInput type
import serverio from '../socket'

const prisma = new PrismaClient();
interface authorData extends Post{
    profile: string|null|undefined,
    author: string|null|undefined,
    email: string|null|undefined
}
interface commentsData extends comment{
    profile: string|null|undefined,
    author: string|null|undefined,
    email: string|null|undefined
}
type Author = {
    email: string|null|undefined;
    name:  string|null|undefined;
    profileImage:  string|null|undefined;
    // Add other author fields if needed
};
const newPost = async (req: Request, res: Response) => {
    console.log(req.body,'create');
    const now= new Date(Date.now());
    let day: number|string = now.getDate();
    let month: number|string= now.getMonth();
    let year: number|string= now.getFullYear()%100
    let hours: number|string= now.getHours();
    let minutes: number|string= now.getMinutes();
    day=day<10?`0${day}`:day;
    month=month<10?`0${month}`:month;
    year=year<10?`0${year}`:year;
    hours=hours<10?`0${hours}`:hours;
    minutes=minutes<10?`0${minutes}`:minutes;
    const date=`${day}/${month}/${year} ${hours}:${minutes}`
try {
    const response:Post=await prisma.post.create({
        data:{
            content: req.body.post,
            GIF: req.body.gif,
            published: String(date),
            location: req.body.location,
            Image: req.body.image,
            videoUrl: req.body.videoUrl,
            author:{
                connect:{
                    email: req.body.author
                }
            },
        }
    })
    console.log(response);
    res.status(200).json(response)
    
} catch (error) {
    console.log(error);
    
}
}

const getPosts= async (req: Request, res: Response) => {
    const email:String|undefined=req.body.email;
    console.log(email,'getposts');
    const socketId=req.body.socketId;
    console.log(socketId);
    let response: user|null =null;
    try{
    const io = serverio.getIO();
    const socket=io.sockets.sockets.get(socketId!);
    if(email){
        socket?.join((email as string));
    }
        // const socketSave=await prisma.socket.create({
        //     data:{
        //         socketId: socketId,
        //         userId: (email as string),
        //     }
        // })
        response= await prisma.user.findUnique({
            where:{
                email:String(email)
            }
        })
        // res.status(200).json(response);
    }
    catch(error){
        console.log(error);
    }
    const followers: string[]|undefined=response?.followers;
    try {
        let allposts: authorData[] = [];
        const response: Post[] = await prisma.post.findMany({
            where: {
            authorId: {
                in: followers || []
            }
            },
            include:{
                likes:true
            }
        });
        const authorIds: string[] = Array.from(new Set(response.map(post => post.authorId))) as string[];
        const authors=await prisma.user.findMany({
            where:{
                email:{
                    in: authorIds
                }
            }
        })
        const authorMap: { [key: string]: any } = authors.reduce((map:{[key:string]:user}, author) => {
            map[author.email] = author;
            return map;
        }, {})
        allposts = response.map((post: Post) => {
            const author: Author = authorMap[post.authorId];
            return { ...post, profile: author.profileImage, author: author.name, email: author.email };
        });
        console.log(allposts,"allposts",socketId);
        res.cookie('socketId',socketId,{httpOnly:true,secure:true, sameSite:'none'});
        return res.status(200).json(allposts); 
    } catch (error) {
        console.log(error);
        
    }
}

const getAllPosts = async (req: Request, res: Response) => {
    console.log('getallposts');
    let response: Post[]|null =null;
    let allposts: authorData[] = []; // Initialize the 'allposts' variable
    try{
        response= await prisma.post.findMany()
        // // console.log(response);
        const authorIds: string[] = Array.from(new Set(response.map(post => post.authorId))) as string[];
        const authors=await prisma.user.findMany({
            where:{
                email:{
                    in: authorIds
                }
            }
        })
        const authorMap: { [key: string]: any } = authors.reduce((map:{[key:string]:Author}, author) => {
            map[author.email] = author;
            return map;
        }, {})
        allposts = response.map((post: Post) => {
            const author: Author = authorMap[post.authorId];
            return { ...post, profile: author.profileImage, author: author.name, email: author.email };
        });
        console.log(allposts);
        return res.status(200).json(allposts);        

    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const addLikes= async (req: Request, res: Response) => {
    console.log(req.body,'addlikes');
    try {
    const id: number = Number(req.body.id);
    const liker:String=req.body.liker;
    console.log(id,liker);
    
    const user=await prisma.user.findUnique({
        where:{
            email:String(liker)
        }
    })
    console.log(user);
    
    const post=await prisma.post.findUnique({
        where:{
            id:id   
        },
        include:{
            likes:true
        }
    })
    console.log(post);
    
    const likesArray=post?.likes;
    const isPresent=likesArray?.some(like=>like.userId===liker);
    console.log(isPresent);
    
    if(isPresent){
        return res.status(200).json({msg:'Already liked'});
    }
   
    const like= await prisma.likes.create({
        data:{
            user:{
                connect:{
                    email:String(liker)
                }
            },
            
            post:{
                connect:{
                    id:id
                }
            }
        }
    })
    const updatePosts= await prisma.post.update({
        where:{
            id:id
        },
        data:{
            likeNumber:{
                increment:1
            }
    }
    })
    console.log(updatePosts);
    
    const likes = (likesArray?.length ?? 0) + 1;
        return res.status(200).json({ likes: likes, msg: "Likes added successfully" });
        
    } catch (error) {
     console.log(error);
        
    }
}
const addComments= async (req: Request, res: Response) => {
    console.log(req.body,'addcomments');
    
try {
    const comment:comment= await prisma.comment.create({
        data:{
            content: req.body.comment,
            postId: req.body.postId,
            authorId: req.body.authorId,
            published: String(req.body.published)
        }
    })
    console.log(comment);
    
    const postComment= await prisma.post.update({
        where:{
            id: Number(req.body.postId)
        }, 
        data:{
            comments:{
                connect:{id:comment.id}
            }
        },
        include:{
            comments:true
        }
    })
    console.log(postComment);
    
    res.status(200).json(postComment);
} catch (error) {
    console.log(error);
    
}
}

const getComments= async (req: Request, res: Response) => {
    console.log(req.body,'getcomments');
    try {
        const postComments = await prisma.post.findUnique({
            where:{
                id: Number(req.body.postId)
            },
        }).comments();
        console.log(postComments);
        let authorIds:string[]
        if(postComments){
        authorIds=Array.from(new Set(postComments.map(comment => comment.authorId)))as string[];
        const authors=await prisma.user.findMany({
            where:{
                email:{
                    in: authorIds
                }
            }
        })
        const authorMap:{[key:string]:Author}=authors.reduce((map:{[key:string]:Author},author)=>{
            map[author.email]=author;
            return map
        },{})
        console.log(authorMap);
        
        const commentsMap:commentsData[]=postComments.map((comment:comment)=>{
            const author:Author= authorMap[comment.authorId];
            return{...comment, profile: 'https://shark-app-ahkas.ondigitalocean.app/'+author.profileImage, author: author.name, email: author.email};
        })
        return res.status(200).json(commentsMap);
    }
    else{
        return res.status(200).json({msg:'no comments present'});
    }

    } catch (error) {
        console.log(error);
        
    }
}
const posts = { newPost,getPosts,getAllPosts,addLikes,addComments,getComments };
export default posts 