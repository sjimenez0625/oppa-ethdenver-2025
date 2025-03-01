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
  Param,
  HttpStatus
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  CRUD_BASE_CONFIG,
} from '../../shared/constants/crud';
import { Identity } from '../entities/identity.entity';
import { IdentityService } from '../services/identity.service';
import { IdentityTransferInput } from '../dtos/identity-transfer-input.dto';
import { IdentityPrivateKeyInput } from '../dtos/identity-private-key-input.dto';
import { IdentityBalanceOutput, IdentityHistoryOutput, IdentityTransferOutput } from '../dtos/identity-output.dto';

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

  // Create
  @Post('create/:userId')
  @ApiOperation({
    summary: 'Create new identity',
    description: 'This endpoint generates a new identity and returns the credentials for the new identity'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Identity
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user',
    type: String
  })
  async create(
    @Param('userId') userId: string,
  ) {
    return this.service.createIdentity(userId);
  }

  // Balance
  @Patch('balance/:accountId')
  @ApiOperation({
    summary: 'Get balance by Account ID',
    description: 'This endpoint needs the Account ID in Hex format and returns the ICP balance of the specified account'
  })
  @ApiResponse({
    status: HttpStatus.OK, 
    type: IdentityBalanceOutput
  })
  @ApiParam({
    name: 'accountId',
    description: 'The unique identifier of the account in Hex format',
    type: String
  })
  async getBalanceById(
    @Param('accountId') accountId: string,
    @Body() input: IdentityPrivateKeyInput
  ) {
    return this.service.getBalance(accountId, input)
  }

  // Transfer
  @Post('transfer')
  @ApiOperation({
    summary: 'Post transfer ICP',
    description: 'This endpoint needs the credentials of From and To identities in Hex format, the amount that we want to transfer and an optional memo and it transfers the ICP and returns the information of the transaction'
  })
  @ApiResponse({
    status: HttpStatus.OK, 
    type: IdentityTransferOutput
  })
  async transfer(
    @Body() input: IdentityTransferInput,
  ) {
    return this.service.transfer(input);
  }

  // History
  @Patch('history/:accountId')
  @ApiOperation({
    summary: 'Get history of transactions by Account ID',
    description: 'This endpoint needs the Account ID in Hex format and returns the history of transactions for that account'
  })
  @ApiResponse({
    status: HttpStatus.OK, 
    type: IdentityHistoryOutput
  })
  @ApiParam({
    name: 'accountId',
    description: 'The unique identifier of the account in Hex format',
    type: String
  })
  async getHistoryById(
    @Param('accountId') accountId: string,
    @Body() input: IdentityPrivateKeyInput
  ) {
    return this.service.getHistory(accountId, input)
  }
}
