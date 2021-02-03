
import {Field, ObjectType} from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn} from 'typeorm';
@ObjectType()
@Entity()
export class PostEntity{

    @Field()
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Field()
    @Column()
    creator:string

    @Field()
    @Column()
    details:string

    @Field()
    @Column()
    imgSrc:string

    @Field()
    @CreateDateColumn()
    createdAt:Date
    
}