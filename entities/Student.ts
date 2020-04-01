import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './Project';

@Entity()
export class Student extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  course_name!: string;

  @Column({ nullable: true })
  github_username!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Project, project => project.students)
  @JoinColumn()
  project!: Promise<Project>;
}