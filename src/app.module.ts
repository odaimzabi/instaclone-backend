import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Follower } from './follower/follower.entity';
import { PostEntity } from './posts/post.entity';
import { PostsModule } from './posts/post.module';
import { PostsResolver } from './posts/post.resolver';
import { FollowRequest } from './request/request.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';

@Module({
  imports: [

    GraphQLModule.forRoot({
      cors:false,
      playground:true,
      include: [UserModule,PostsModule],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions:{

        onConnect:(connectionParams:any,ws,context)=>{
          console.log(connectionParams)
          return connectionParams
        }
      },
      context:({req,res,connection})=>({req,res,connection})
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      logging:true,
      username: 'postgres',
      password: 'root',
      database: 'instagram-clone',
      entities: [User,FollowRequest,Follower,PostEntity],
      synchronize: true,
      
    }),

    UserModule,
    PostsModule
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
