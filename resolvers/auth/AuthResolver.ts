import { Resolver, Mutation, Arg } from 'type-graphql'
import { User } from '../../entities/User';
// import { Authenticator } from '../../entities/Authenticator';
import { generateCredential, genereteAssertion } from './helpers';
import { RegisterResponse } from '../../types/RegisterResponse';
import { LoginResponse } from '../../types/LoginResponse';

@Resolver()
export class AuthResolver{
  @Mutation(() => RegisterResponse)
  async register(
    @Arg('username') username: string
  ): Promise<RegisterResponse> {
    const findUser = await User.findOne({ username });

    if(findUser)
      return {
        status: 'failed',
        message: 'User already exists'
      }
    else {
      const user = await User.create({
        username
      }).save();

      const serverCredential = generateCredential(user.id, username);
      console.log(serverCredential);
      return {
        status: 'ok',
        credential: serverCredential
      };
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('username') username: string
  ): Promise<LoginResponse>{
    const user = await User.findOne({ username });

    if(!user)
      return {
        status: 'failed',
        message: 'User does not exist'
      };
    else{
      const userAuthenticators = await user.authenticators;
      const serverAssertion = genereteAssertion(userAuthenticators);
      return {
        status: 'ok',
        assertion: serverAssertion
      };
    }
  }
}

