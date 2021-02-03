import { Resolver,Query, ObjectType, Field, Mutation, Args, InputType, Context, Subscription } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import {compare} from 'bcrypt'
import {sign} from 'jsonwebtoken'
import { Ctx } from 'src/context/context';
import { checkAuth, createAccessToken, createRefreshToken, getUserFromCtx } from 'src/utils/auth';
import { FollowRequest } from 'src/request/request.entity';
import { PubSub } from 'apollo-server-express';
import { RequestsService } from 'src/request/request.service';
import { Follower } from 'src/follower/follower.entity';
import { check } from 'prettier';

@InputType()
export class UserData{
  @Field()
  email:string;

  @Field()
  username:string;

  @Field()
  password:string;
}


@ObjectType()
class SearchProfileResponse{
  @Field()
  user:User

  @Field({nullable:true})
  isFollowing?:boolean

  @Field({nullable:true})
  isRequested?:boolean
}

@ObjectType()
class LoginResponse{

  @Field()
  accessToken:string

  @Field()
  user:User
}

const pubSub=new PubSub()
const FOLLOW_REQUEST='FOLLOW_REQUEST'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService,private readonly requestsRepo:RequestsService) {}


  @Query(()=>[User],{nullable:true})
  getUsers(@Context()ctx:Ctx){

    return this.userService.findAll()
  }

  @Mutation(()=>Boolean)
  async clearUsers(){
     await this.userService.deleteAll()
    return true
  }
  @Mutation(()=>LoginResponse)
  async login(@Args('email')email:string,@Args('password')password:string,@Context()ctx:Ctx):Promise<LoginResponse>{
      const user=await this.userService.findByEmail(email)
      if (!user){
        throw new Error("Invalid credentials,email does not exist")
      }
      const valid= await compare(password,user.password)

      if (!valid){
        throw new Error("Wrong Password/Email")
      }
        ctx.res.cookie('jid',createRefreshToken(user)
        )
      return {
        accessToken:createAccessToken(user),
        user:user
      }
  }

  @Subscription(()=>FollowRequest,{filter:(payload,variables,context:any)=>getUserFromCtx(payload,variables,context)})
  async followRequestSent(){
      
      return pubSub.asyncIterator(FOLLOW_REQUEST)
  }
  @Mutation(()=>FollowRequest,{nullable:true})
  async sendFollowRequest(@Context()ctx:Ctx,@Args('to')toUser:string){

    let userId:string=null;

    if (checkAuth(ctx)){
      userId=ctx.payload.userId
    }else{
      return false;
    }

    const user= await this.userService.findByuserName(toUser)
    const follower= await this.userService.findById(userId)

    const req=new FollowRequest()
    req.from=follower.username
    req.userId=follower.id
    console.log(req,user)
    pubSub.publish(FOLLOW_REQUEST,{followRequestSent:req})
    
    const doesReqExist=user.Requests.findIndex((item)=>item.from==follower.username)
    // user.Requests=[]
    // await this.userService.updateUser(user)
    // return null
    if (doesReqExist!=-1){
      return null
    }

    const doesFollowerExist=user.Followers.findIndex((item)=>item.username==follower.username)
    if (doesFollowerExist!=-1){
      return null
    }
    user.Requests.push(req)
    await this.userService.updateUser(user)
    const createdReq=this.requestsRepo.createReq(req)
    return createdReq;
    
  }

  @Query(()=>[User])
  async getUsersByTerm(@Args('term')term:string){
   
      return this.userService.findByTerm(term)
  }


  @Query(()=>User,{nullable:true})
  async me(@Context()ctx:Ctx){
    if(checkAuth(ctx)){
      const user=this.userService.findById(ctx.payload.userId)
      return user
    }else{
      return null
    }
  }

  @Query(()=>SearchProfileResponse)
  async searchProfile(@Args("username")username:string,@Context()ctx:Ctx):Promise<SearchProfileResponse>{
      if (checkAuth(ctx)){

          const user= await this.userService.findByuserName(username)
          const loggedInUser= await this.userService.findById(ctx.payload.userId)
          const isFollowing= user.Followers.findIndex((item)=>item.username==loggedInUser.username)  
          if (isFollowing!=-1){
              return {
                user,
                isFollowing:true
              }
          }
          const isRequested=user.Requests.findIndex((item)=>item.from==loggedInUser.username)

          if (isRequested!=-1){
            return {
              user,
              isRequested:true
            }
        }

        return {
          user,
          isFollowing:false
        }

      }else{  
        return null
      }
  }

  @Mutation(()=>Boolean)
  async deleteRequest(@Context()ctx:Ctx,@Args('id')id:number){

    let userId:string=null;

    if (checkAuth(ctx)){
      userId=ctx.payload.userId
    }else{
      return false;
    }

    const user=await this.userService.findById(userId)
    user.Requests=user.Requests.filter(item=>item.id!=id)
    await this.userService.updateUser(user)
    return true
  }
  @Mutation(()=>Boolean)
  async acceptRequest(@Context()ctx:Ctx,@Args('id')id:number){

    let userId:string=null;

    if (checkAuth(ctx)){
      userId=ctx.payload.userId
    }else{
      return false;
    }
      
    const user=await this.userService.findById(userId)

  
    const reqIdx=user.Requests.findIndex(item=>item.id==id)
    if (reqIdx==-1){
      return false;
    }
    const req=user.Requests[reqIdx]
    const reqUser= await this.userService.findByuserName(req.from)

    console.log(reqUser,req)
    const follower=new Follower()
    follower.username=reqUser.username

    user.Requests=user.Requests.filter(item=>item.id!=id)

    user.Followers.push(follower)

    await this.userService.updateUser(user)

    return true;
  }
  @Mutation(()=>User)
  async signUp(@Args('userDetails')details:UserData){
    
    const user=await this.userService.findByEmail(details.email)
    if (user){
      throw new Error("User already exist!")
    }

    

    return this.userService.createUser(details.email,details.username,details.password)
  }

}
