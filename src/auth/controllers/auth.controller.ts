import { Crud } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CRUD_ALL_ROUTES } from '../../shared/constants/crud';
import { AppLogger } from '../../shared/logger/logger.service';

@Crud({
  model: {
    type: Object,
  },
  routes: {
    exclude: CRUD_ALL_ROUTES,
  },
})
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AuthController.name);
  }

  // @Post('login')
  // @ApiOperation({
  //   summary: 'User login API',
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: AuthTokenOutput,
  // })
  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(ClassSerializerInterceptor)
  // async login(@Body() credential: LoginInput): Promise<AuthTokenOutput> {
  //   const authToken = await this.authService.login(credential);
  //   return authToken;
  // }

  // @Post('register')
  // @ApiOperation({
  //   summary: 'User registration API',
  // })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   type: RegisterOutput,
  // })
  // @UseInterceptors(CrudRequestInterceptor)
  // async registerLocal(
  //   @ParsedRequest() req: CrudRequest,
  //   @Body() input: RegisterInput,
  // ): Promise<RegisterOutput> {
  //   const registeredUser = await this.authService.register(req, input);
  //   return registeredUser;
  // }
}
