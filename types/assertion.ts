import { ObjectType, Field } from 'type-graphql';
import { allowCredentials } from './allowCredentials';

@ObjectType()
export class Assertion {
  @Field({ nullable: true })
  challenge?: string;

  @Field(() => [allowCredentials], { nullable: true })
  allowCredentials?: allowCredentials[];

  @Field({ nullable: true })
  userVerification?: string;

  @Field({ nullable: true })
  rpId?: string;

  @Field({ nullable: true })
  timeout?: number;
}
