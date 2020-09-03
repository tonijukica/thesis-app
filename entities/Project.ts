import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Course } from './Course';
import { Student } from './Student';
import { ProductionPreview } from './ProductionPreview';

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  github_url!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  prod_url!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grade!: number;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Course, (course) => course.projects, { onDelete: 'CASCADE' })
  @JoinColumn()
  course!: Promise<Course>;

  @Field(() => [Student])
  @OneToMany(() => Student, (student) => student.project)
  students!: Promise<Student[]>;

  @Field(() => [ProductionPreview])
  @OneToMany(
    () => ProductionPreview,
    (productionPreview) => productionPreview.project
  )
  production_previews!: Promise<ProductionPreview[]>;

  @Field()
  prod_preview_count!: number;
}
