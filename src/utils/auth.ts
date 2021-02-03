import { sign, verify } from "jsonwebtoken";
import { Ctx } from "src/context/context";
import { User } from "src/user/user.entity";



export const createRefreshToken=(user:User)=>{

    console.log(`${process.env.REFRESH_TOKEN_SECRET}`)
    return sign({userId:user.id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"})
}   

export const createAccessToken=(user:User)=>{
    console.log(`${process.env.ACCESS_TOKEN_SECRET}`)
    return sign({userId:user.id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
}

export const getUserFromCtx=(payload:any,variables:any,context:any):boolean | Promise<boolean> =>{

        if (!context.connection.context.authorization){
            return false;
        }   

        if (payload.followRequestSent==null){
            return null
        }
        let token=context.connection.context.authorization.split(' ')[1]
        let userPayload=null

        try{
             userPayload=verify(token,process.env.ACCESS_TOKEN_SECRET)
            console.log(userPayload)
        }catch(err){
            console.log(err)
        }

        const userId=userPayload.userId
        console.log(payload.followRequestSent.userId==userId)
        if (payload.followRequestSent.userId!=userId){
        return true
        }else{
            return false
        }
}

export const checkAuth=(ctx:Ctx)=>{
        const auth=ctx.req?.headers['authorization']
        if (!auth){
            throw new Error("not authenticated")
        }

        try{
            const token=auth.split(' ')[1]
            const payload=verify(token,process.env.ACCESS_TOKEN_SECRET)
            ctx.payload=payload as any
         
        }catch(err){
            console.log(err)
            return false
        }

        return true
}