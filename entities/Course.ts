import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Project } from './Project';

@ObjectType()
@Entity()
export class Course extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column()
	course_name!: string;

	@Field()
	@Column()
	year!: string;

	@Field()
	@CreateDateColumn()
	created_at!: Date;

	@Field(() => [Project])
	@OneToMany(() => Project, (project) => project.course)
	projects!: Promise<Project[]>;

	@Field()
	projects_count!: number;
}
