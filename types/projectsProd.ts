import { ObjectType, Field} from 'type-graphql';

@ObjectType()
export class projectsProd{
  @Field()
  id?: number;

  @Field({ nullable: true })
  prod_url?: string;
}
