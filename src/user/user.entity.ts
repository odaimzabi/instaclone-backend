
import { Field, ObjectType } from '@nestjs/graphql';
import { Follower } from 'src/follower/follower.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BaseEntity, OneToMany, JoinColumn, OneToOne, ManyToMany } from 'typeorm';
import {FollowRequest} from '../request/request.entity'

@Entity()
@ObjectType()
export class User extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;
  
  
  @Field(()=>[Follower],{nullable:true})
  @OneToMany(()=>Follower,(follower)=>follower.user,{cascade:true,onDelete:"CASCADE"})
  Followers:Follower[]

  @Field(()=>[FollowRequest])
  @OneToMany(()=>FollowRequest,(request)=>request.user,{cascade:true})
  Requests:FollowRequest[]
}