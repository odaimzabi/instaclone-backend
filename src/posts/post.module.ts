import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { FollowRequest } from 'src/request/request.entity';
import { RequestsService } from 'src/request/request.service';

@Module({
  imports:[TypeOrmModule.forFeature([PostEntity])],
  providers: [PostsService, PostsResolver],
  exports:[PostsService,PostsResolver]
})
export class PostsModule {}
