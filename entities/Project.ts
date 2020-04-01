import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from './Course';
import { Student } from './Student';
import { ProductionPreview } from './ProductionPreview';

@Entity()
export class Project extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  github_url!: string;

  @Column()
  prod_url!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Course, course => course.projects)
  @JoinColumn()
  course!: Promise<Course>;

  @OneToMany(() => Student, student => student.project)
  students!: Promise<Student[]>;

  @OneToMany(() => ProductionPreview, productionPreview => productionPreview.project)
  production_preview!: Promise<ProductionPreview[]>;

}