import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppLogger } from '../../shared/logger/logger.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  // async validateUser(
  //   email: string,
  //   pass: string,
  // ): Promise<UserAccessTokenClaims> {
  //   // The userService will throw Unauthorized in case of invalid username/password.
  //   const user = await this.userService.validateEmailPassword(email, pass);

  //   // Prevent disabled users from logging in.
  //   if (user.isAccountDisabled) {
  //     throw new UnauthorizedException('This user account has been disabled');
  //   }

  //   return {
  //     id: user.id,
  //     username: user.username,
  //     roles: [ROLE.USER],
  //   };
  // }

  // async login(credential: LoginInput): Promise<AuthTokenOutput> {
  //   const { email, password } = credential;

  //   const user = await this.validateUser(email, password);

  //   return this.getAuthToken(user);
  // }

  // async register(
  //   req: CrudRequest,
  //   input: RegisterInput,
  // ): Promise<RegisterOutput> {
  //   const user = await this.userService.findOne({
  //     where: [
  //       {
  //         email: input.email,
  //       },
  //     ],
  //   });

  //   if (user) throw new UnauthorizedException('Username already exists');

  //   input.roles = [ROLE.USER];
  //   input.isAccountDisabled = false;
  //   input.username = input.username || input.email;

  //   input.password = await hash(input.password, 10);

  //   const registeredUser = await this.userService.createOne(req, input);
  //   return plainToClass(RegisterOutput, registeredUser, {
  //     excludeExtraneousValues: true,
  //   });
  // }

  // async refreshToken(): Promise<AuthTokenOutput> {
  //   this.logger.log(`${this.refreshToken.name} was called`);

  //   const user = await this.userService.findOneBy({
  //     id: 1,
  //   });
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid user id');
  //   }

  //   return this.getAuthToken(user);
  // }

  // getAuthToken(user: UserAccessTokenClaims | User): AuthTokenOutput {
  //   const subject = { sub: user.id };
  //   const payload = {
  //     username: user.username,
  //     sub: user.id,
  //     roles: user.roles,
  //   };

  //   const authToken = {
  //     refreshToken: this.jwtService.sign(subject, {
  //       expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
  //     }),
  //     accessToken: this.jwtService.sign(
  //       { ...payload, ...subject },
  //       { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
  //     ),
  //   };
  //   return plainToClass(AuthTokenOutput, authToken, {
  //     excludeExtraneousValues: true,
  //   });
  // }
}
