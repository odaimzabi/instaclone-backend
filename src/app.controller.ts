import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {Request,Response} from 'express'
import { verify } from 'jsonwebtoken';
import { UserService } from './user/user.service';
import { createAccessToken, createRefreshToken } from './utils/auth';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly userService:UserService) {}

  @Get()
  hello(){
    return "hello"
  }
  
  @Post('/refresh-token')
  async refreshToken(@Req()req:Request,@Res()res:Response){
      const token=req.cookies.jid
      if (!token){
        res.send({success:false,accessToken:""})
      }
      let payload:any=null

      try{
        payload=verify(token,process.env.REFRESH_TOKEN_SECRET)
             
      }catch(err){
        console.log(err)
        return res.send({success:false,accessToken:""})
      }

      const user= await this.userService.findById(payload.userId)
      if (!user){
        return res.send({success:false,accessToken:""})
      }

      res.cookie('jid',createRefreshToken(user))

      return res.send({success:true,accessToken:createAccessToken(user)})
  }
}
