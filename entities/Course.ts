import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, OneToMany } from 'typeorm';
import { Project } from './Project';

@Entity()
export class Course extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  course_name!: string;

  @Column()
  year!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Project, project => project.course)
  projects!: Promise<Project[]>;
}