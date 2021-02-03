import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import * as bcrypt from 'bcrypt'
import { RequestsService } from 'src/request/request.service';
@Injectable()
export class PostsService  {

    constructor(
        @InjectRepository(PostEntity)
        private postsRepository: Repository<PostEntity>,
      ) {}
      
       async createPost(creator:string,details:string,imgSrc:string):Promise<PostEntity>{
            return await this.postsRepository.save({creator,details,imgSrc})
        }   
        async editPost(id:string,details:string){
          const post= await this.postsRepository.findOne(id)
          if (!post){
            return false
          }
          post.details=details
          await this.postsRepository.save(post)
          return true
        }

        async deletePost(id:string){
          return this.postsRepository.delete(id)
        }
        async deletePosts(){
            this.postsRepository.clear()
        }
        async findAll(){
            return await this.postsRepository.find()
        }
      async paginate(page:number){

        const skippedItems=(page-1)*5;
        const results= await this.postsRepository.createQueryBuilder("post")
                .orderBy('"createdAt"','DESC')
                .limit(5)
                .offset(skippedItems)
                .getMany()
        console.log(results)
        return results
      }
      findById(id:string): Promise<PostEntity>{
        return this.postsRepository.findOne({where:{id:id}});
      }

    }
      
   