import { InputType, Field } from 'type-graphql';
import { StudentInput } from './Student';

@InputType()
export class ProjectInput {

  @Field()
  name!: string;

  @Field()
  github_url!: string;

  @Field()
  prod_url?: string;

  @Field(() => [StudentInput],{ nullable: true })
  data?: StudentInput[]

}