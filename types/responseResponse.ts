import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class ResponseResponse {
  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  message?: string;
}
