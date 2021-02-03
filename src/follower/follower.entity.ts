import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Follower{

    @Field()
    @PrimaryGeneratedColumn()
    id:number

    @Field()
    @Column({nullable:true})
    username:string

    @ManyToOne(()=>User,(user)=>user.Followers)
    user:User
}