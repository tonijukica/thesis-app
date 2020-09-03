import { Field, InputType } from 'type-graphql';
import { Response } from './response';

@InputType()
export class ResponseInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  rawId?: string;

  @Field(() => Response, { nullable: true })
  response?: Response;

  @Field({ nullable: true })
  type?: string;
}
