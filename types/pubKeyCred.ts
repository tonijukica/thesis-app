import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class pubKeyCred {
  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  alg?: number;
}
