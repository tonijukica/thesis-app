import { InputType, Field } from 'type-graphql';

@InputType()
export class StudentInput {

  @Field()
  name!: string;

  @Field()
  github_username!: string;

}