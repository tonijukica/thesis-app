import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class Authenticator extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  credID!: string;

  @Field()
  @Column()
  fmt!: string;

  @Field()
  @Column()
  publicKey!: string;

  @Field()
  @Column()
  counter!: number;

  @ManyToOne(() => User, (user) => user.authenticators, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: Promise<User>;
}
