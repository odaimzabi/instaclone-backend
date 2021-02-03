import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { FollowRequest } from 'src/request/request.entity';
import { RequestsService } from 'src/request/request.service';

@Module({
  imports:[TypeOrmModule.forFeature([User,FollowRequest])],
  providers: [UserResolver, UserService,RequestsService],
  exports:[UserService,UserResolver]
})
export class UserModule {}
