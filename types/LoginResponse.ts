import { ObjectType, Field } from 'type-graphql';
import { Assertion } from './assertion';

@ObjectType()
export class LoginResponse {
  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  message?: string;

 @Field(() => Assertion, { nullable: true })
 assertion?: Assertion

}
