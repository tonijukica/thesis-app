import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Authenticator } from './Authenticator';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  username!: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @Field(() => [Authenticator])
  @OneToMany(() => Authenticator, (authenticator) => authenticator.user)
  authenticators!: Promise<Authenticator[]>;
}
