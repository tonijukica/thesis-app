import { InputType, Field } from 'type-graphql';

@InputType()
export class StudentInput {
	@Field()
	name!: string;

	@Field({ nullable: true })
	github_username?: string;
}
