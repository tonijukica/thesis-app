import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';

@ObjectType()
@Entity()
export class ProductionPreview extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  image!: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Project, project => project.production_preview, { onDelete: "CASCADE" })
  @JoinColumn()
  project!: Promise<Project>;
}