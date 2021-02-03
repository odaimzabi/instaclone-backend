import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt'
import { RequestsService } from 'src/request/request.service';
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private requestsRepo:RequestsService
      ) {}
      
      findByTerm(term:string):Promise<User[]>{
        return  this.usersRepository.createQueryBuilder("user")
          .where("user.username like :name",{name:`%${term}%`})
          . getMany()
      }
      findAll(): Promise<User[]> {
        return this.usersRepository.find({relations:['Requests','Followers']});
      }
      findById(id:string): Promise<User>{
        return this.usersRepository.findOne({where:{id},relations:['Requests','Followers']});
      }
      findByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({where:{email},relations:['Requests','Followers']});
      }

      findByuserName(username: string): Promise<User> {
        return this.usersRepository.findOne({where:{username},relations:['Requests','Followers']});
      }
    
      async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
      }
      
      async deleteAll(){
        await this.requestsRepo.deleteAll()
        await this.usersRepository.clear()
      }

      async updateUser(user:User){
        return await this.usersRepository.save(user)
      }
      async createUser(email:string,username:string,password:string){

        password=await bcrypt.hash(password,10)
          const Requests=[]
          const Followers=[]
          return this.usersRepository.save({email,username,password,Followers,Requests})
      }

}
