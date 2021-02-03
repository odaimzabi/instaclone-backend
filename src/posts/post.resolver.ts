import { Post } from "@nestjs/common";
import { Context,Query,Mutation, Args, ObjectType, Field } from "@nestjs/graphql";
import { Resolver } from "@nestjs/graphql";
import { Ctx } from "src/context/context";
import { RequestsService } from "src/request/request.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { checkAuth } from "src/utils/auth";
import { PostEntity } from "./post.entity";
import { PostsService } from "./post.service";


@ObjectType()
class PostsResponse{

    @Field(()=>[PostEntity])
    posts:PostEntity[]
    
    @Field()
    nextPage:number
}

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService:PostsService) {}
  

    @Query(of=>[PostEntity],{nullable:true})
    async fetchPosts(){

        // this.postsService.deletePosts()
        // return null
        return await this.postsService.findAll()
    }

    @Mutation(()=>Boolean)
    async editPost(@Args('id')id:string,@Args('details')details:string){
       return this.postsService.editPost(id,details)
    }
    @Mutation(()=>Boolean)
    async deletePost(@Args('id')id:string){
       if((await this.postsService.deletePost(id)).affected==0){
          return false
       }
       return true
    }
  @Query(of=>PostsResponse,{nullable:true})
  async paginatePosts(@Args('page')page:number,@Context()ctx:Ctx):Promise<PostsResponse>{

    console.log(ctx.req.headers)

      const authed=checkAuth(ctx)
      if(authed){
    const results= await this.postsService.paginate(page)

    if (results.length==0){
        return {
            posts:results,
            nextPage:-1
        }
    }else{
        return {
            posts:results,
            nextPage:page+1
        }
    }
  }
  }
  @Mutation(()=>PostEntity,{nullable:true})
  async createPost(@Args('creator')creator:string,@Args('details')details:string,@Args('imgSrc')imgSrc:string){
            return await this.postsService.createPost(creator,details,imgSrc)
  }

}