import { ObjectType, Field } from 'type-graphql';
import { Credential } from './credential';

@ObjectType()
export class RegisterResponse {
  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  message?: string;

 @Field(() => Credential, { nullable: true })
 credential?: Credential

}
