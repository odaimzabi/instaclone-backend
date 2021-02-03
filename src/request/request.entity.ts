import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class FollowRequest{
    
    @Field()
    @PrimaryGeneratedColumn()
    id:number

    @Field()
    @Column()
    from:string

    @Field()
    @Column({nullable:true})
    userId:string

    @ManyToOne(()=>User,(user)=>user.Requests)
    user:User
}