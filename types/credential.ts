import { ObjectType, Field } from 'type-graphql';
import { rp } from './rp';
import { pubKeyCred } from './pubKeyCred';
import { user } from './user';

@ObjectType()
export class Credential {
  @Field({ nullable: true })
  challenge?: string;

  @Field(() => rp, { nullable: true })
  rp?: rp;

  @Field(() => user, { nullable: true })
  user?: user;

  @Field({ nullable: true })
  attestation?: string;

  @Field(() => [pubKeyCred], { nullable: true })
  pubKeyCredParams?: pubKeyCred[];
}
