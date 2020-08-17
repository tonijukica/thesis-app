import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class rp {
  @Field({ nullable: true })
  name?: string;
}
