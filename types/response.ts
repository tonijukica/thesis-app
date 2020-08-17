import { InputType, Field } from 'type-graphql';

@InputType()
export class Response {
  @Field({ nullable: true })
  attestationObject?: string;

  @Field({ nullable: true })
  clientDataJSON?: string;

  @Field({ nullable: true })
  authenticatorData?: string;

  @Field({ nullable: true })
  signature?: string;
}
