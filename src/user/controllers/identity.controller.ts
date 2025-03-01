import {
  Crud,
  CrudAuth,
  CrudController
} from '@dataui/crud';
import {
  Body,
  Controller,
  Patch,
  Post,
  Param
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import {
  CRUD_BASE_CONFIG,
} from '../../shared/constants/crud';
import { Identity } from '../entities/identity.entity';
import { IdentityService } from '../services/identity.service';
import { IdentityTransferInput } from '../dtos/identity-transfer-input.dto';
import { IdentityPrivateKeyInput } from '../dtos/identity-private-key-input.dto';

@Crud({
  model: {
    type: Identity,
  },
  routes: {
    only: ['getOneBase'],
    ...CRUD_BASE_CONFIG.routes,
  },
})
@CrudAuth({
  property: 'identity',
})
@ApiTags('identity')
@Controller('identity')
export class IdentityController implements CrudController<Identity> {
  constructor(public readonly service: IdentityService) {}

  @Post('create')
  async create() {
    return this.service.createIdentity();
  }

  @Patch('balance/:accountId')
  @ApiParam({
    name: 'accountId',
    description: 'The unique identifier of the account',
    type: String
  })
  async getBalanceById(
    @Param('accountId') accountId: string,
    @Body() input: IdentityPrivateKeyInput
  ) {
    return this.service.getBalance(accountId, input)
  }

  @Post('transfer')
  async transfer(
    @Body() input: IdentityTransferInput,
  ) {
    return this.service.transfer(input);
  }

  @Patch('history/:accountId')
  @ApiParam({
    name: 'accountId',
    description: 'The identifier of the account that we want to see the history',
    type: String
  })
  async getHistoryById(
    @Param('accountId') accountId: string,
    @Body() input: IdentityPrivateKeyInput
  ) {
    return this.service.getHistory(accountId, input)
  }
}
