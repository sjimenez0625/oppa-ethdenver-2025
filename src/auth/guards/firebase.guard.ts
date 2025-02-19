import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { STRATEGY_JWT } from '../constants/strategy.constant';

@Injectable()
export class FirebaseGuard extends AuthGuard(STRATEGY_JWT) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

   
  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException(`${info}`);
    }
    return user;
  }
}
