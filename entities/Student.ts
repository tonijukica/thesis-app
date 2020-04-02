import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';

@ObjectType()
@Entity()
export class Student extends BaseEntity {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ nullable: true })
  github_username!: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Project, project => project.students)
  @JoinColumn()
  project!: Promise<Project>;
}