import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/services/user.service';
import { ROLE } from '../constants/role.constant';

export type Auth0Payload = {
  iss: string;
  sub: string;
  aud: string | string[];
  iat: number;
  exp: number;
  gty: string;
  azp: string;
};

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get<string>('auth0.domain')}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('auth0.audience'),
      issuer: `https://${configService.get<string>('auth0.domain')}/`,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: Auth0Payload) {
    const user = await this.userService.findOne({
      where: {
        authId: payload.sub,
      },
    });

    return {
      authId: payload.sub,
      username: payload.sub,
      roles: [ROLE.USER],
      user,
    };
  }
}
