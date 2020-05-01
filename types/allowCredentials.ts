import { ObjectType, Field} from 'type-graphql';

@ObjectType()
export class allowCredentials{
  @Field()
  type?: string;

  @Field()
  id?: string;

  @Field(() => [String])
  transports?: string[];
}
