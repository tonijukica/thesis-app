import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './Project';

@Entity()
export class ProductionPreview extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Project, project => project.production_preview)
  @JoinColumn()
  project!: Promise<Project>;
}