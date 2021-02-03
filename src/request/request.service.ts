import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FollowRequest } from "./request.entity";


@Injectable()
export class RequestsService {

    constructor(
        @InjectRepository(FollowRequest)
        private requestsRepository: Repository<FollowRequest>,

      ) {}

      async deleteAll(){
          this.requestsRepository.clear()
      }

      async createReq(req:FollowRequest){
        return this.requestsRepository.save(req)
      }
    }