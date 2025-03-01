import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@dataui/crud';
import {
  applyDecorators,
  Body,
  Controller,
  Get,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ROLE } from '../../auth/constants/role.constant';
import { OidcAuth } from '../../auth/types/auth.type';
import {
  BASE_DECORATORS,
  BASE_INTERCEPTORS,
  CRUD_BASE_CONFIG,
} from '../../shared/constants/crud';
import { User } from '../../user/entities/user.entity';
import { UpdateUserInput } from '../dtos/user-update-input.dto';
import { UserService } from '../services/user.service';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getOneBase'],
    ...CRUD_BASE_CONFIG.routes,
  },
})
@CrudAuth({
  property: 'user',
})
@ApiTags('user')
@Controller('user')
export class UserController implements CrudController<User> {
  constructor(public readonly service: UserService) {}

  @Get('me')
  @UseInterceptors(CrudRequestInterceptor)
  @applyDecorators(...BASE_DECORATORS)
  @UseInterceptors(...BASE_INTERCEPTORS)
  async getMe(@ParsedRequest() req: CrudRequest<OidcAuth>) {
    if (!req.auth) return null;

    if (req.auth.user) return req.auth.user;

    const user = await this.service.createOne(req, {
      authId: req.auth.authId,
      roles: [ROLE.USER],
    });

    return user;
  }

  @Patch('me')
  @UseInterceptors(CrudRequestInterceptor)
  @applyDecorators(...BASE_DECORATORS)
  @UseInterceptors(...BASE_INTERCEPTORS)
  async updateMe(
    @ParsedRequest() req: CrudRequest<OidcAuth>,
    @Body() input: UpdateUserInput,
  ) {
    if (!req.auth) return null;

    return this.service.patchUserById(req.auth.user.id, input);
  }
}
