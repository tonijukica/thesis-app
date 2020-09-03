import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import base64url from 'base64url';
import { User } from '../../entities/User';
import { Authenticator } from '../../entities/Authenticator';
import {
  generateCredential,
  genereteAssertion,
  verifyAttestationResponse,
  verifyAssertionResponse,
} from './helpers';
import { IContext } from '../../types/IContext';
import { RegisterResponse } from '../../types/RegisterResponse';
import { LoginResponse } from '../../types/LoginResponse';
import { ResponseInput } from '../../types/responseInput';
import { ResponseResponse } from '../../types/responseResponse';

@Resolver()
export class AuthResolver {
  @Mutation(() => RegisterResponse)
  async register(
    @Arg('username') username: string,
    @Ctx() ctx: IContext
  ): Promise<RegisterResponse> {
    const findUser = await User.findOne({ username });

    if (findUser)
      return {
        status: 'failed',
        message: 'User already exists',
      };
    else {
      const user = await User.create({
        username,
      }).save();

      const serverCredential = generateCredential(user.id, username);

      ctx.req.session!.challenge = serverCredential.challenge;
      ctx.req.session!.username = username;

      return {
        status: 'ok',
        credential: serverCredential,
      };
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('username') username: string,
    @Ctx() ctx: IContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ username });

    if (!user)
      return {
        status: 'failed',
        message: 'User does not exist',
      };
    else {
      const userAuthenticators = await user.authenticators;
      const serverAssertion = genereteAssertion(userAuthenticators);
      ctx.req.session!.challenge = serverAssertion.challenge;
      ctx.req.session!.username = username;

      return {
        status: 'ok',
        assertion: serverAssertion,
      };
    }
  }

  @Mutation(() => ResponseResponse)
  async registerResponse(
    @Arg('input') { id, rawId, response, type }: ResponseInput,
    @Ctx() ctx: IContext
  ): Promise<ResponseResponse | undefined> {
    if (!id || !rawId || !response || !type || type !== 'public-key')
      return {
        status: 'failed',
        message: 'Missing fields or type is not public-key',
      };
    const { username } = ctx.req.session!;
    const user = await User.findOne({ username });
    const clientData = JSON.parse(base64url.decode(response.clientDataJSON!));
    if (clientData.challenge !== ctx.req.session!.challenge)
      return {
        status: 'failed',
        message: 'Challenges dont match',
      };
    if (response.attestationObject !== undefined) {
      const result: any = await verifyAttestationResponse(response);
      if (result.verified) {
        const { fmt, publicKey, counter, credID } = result.authrInfo;
        const authr = await Authenticator.create({
          fmt,
          publicKey,
          counter,
          credID,
        }).save();
        (await user!.authenticators).push(authr);
        await user?.save();
        ctx.req.session!.challenge = null;
        ctx.req.session!.username = null;
        return {
          status: 'ok',
        };
      } else
        return {
          status: 'failed',
          message: 'Can not authenticate signature!',
        };
    } else
      return {
        status: 'failed',
        message: 'Missing attestation!',
      };
  }

  @Mutation(() => ResponseResponse)
  async loginResponse(
    @Arg('input') { id, rawId, response, type }: ResponseInput,
    @Ctx() ctx: IContext
  ): Promise<ResponseResponse | undefined> {
    if (!id || !rawId || !response || !type || type !== 'public-key')
      return {
        status: 'failed',
        message: 'Missing fields or type is not public-key',
      };
    const { username } = ctx.req.session!;
    const user = await User.findOne({ username });
    const clientData = JSON.parse(base64url.decode(response.clientDataJSON!));
    if (clientData.challenge !== ctx.req.session!.challenge)
      return {
        status: 'failed',
        message: 'Challenges dont match',
      };
    if (response.authenticatorData !== undefined) {
      const authenticators = await user?.authenticators;
      if (authenticators) {
        const result: any = await verifyAssertionResponse(
          response,
          id,
          authenticators
        );

        if (result.verified) {
          ctx.req.session!.challenge = null;
          ctx.req.session!.authenticated = true;
          return { status: 'ok' };
        } else
          return {
            status: 'failed',
            message: 'Can not authenticate signature!',
          };
      } else
        return {
          status: 'failed',
          message: 'User does not have any authenticators',
        };
    } else
      return {
        status: 'failed',
        message: 'Can not determine response type!',
      };
  }

  @Mutation(() => ResponseResponse)
  async logout(@Ctx() ctx: IContext): Promise<ResponseResponse | undefined> {
    ctx.req.session = null;
    return {
      status: 'ok',
    };
  }

  @Mutation(() => ResponseResponse)
  async registerFail(
    @Ctx() ctx: IContext
  ): Promise<ResponseResponse | undefined> {
    const username = ctx.req.session!.username;
    await User.delete({ username });
    return {
      status: 'ok',
    };
  }
}
