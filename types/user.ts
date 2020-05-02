import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class user{
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  displayName?: string
}
