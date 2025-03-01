import { Crud, CrudController } from '@dataui/crud';
import {
  Body,
  Controller,
  Post,
  Param,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CRUD_BASE_CONFIG } from '../../shared/constants/crud';
import { Identity } from '../entities/identity.entity';
import { IdentityService } from '../services/identity.service';
import { IdentityTransferInput } from '../dtos/identity-transfer-input.dto';
import {
  IdentityBalanceOutput,
  IdentityHistoryOutput,
  IdentityTransferOutput,
} from '../dtos/identity-output.dto';

@Crud({
  model: {
    type: Identity,
  },
  ...CRUD_BASE_CONFIG,
  routes: {
    only: ['getOneBase'],
    ...CRUD_BASE_CONFIG.routes,
  },
})
@ApiTags('user identity')
@Controller('user/:userId/identity')
export class IdentityController implements CrudController<Identity> {
  constructor(public readonly service: IdentityService) {}

  // Create
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Create new identity',
    description:
      'This endpoint generates a new identity and returns the credentials for the new identity',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: Identity,
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user',
    type: String,
  })
  async create(@Param('userId') userId: string) {
    return this.service.createIdentity(userId);
  }

  // Balance
  @Post('balance')
  @ApiOperation({
    summary: 'Get balance by Account ID',
    description:
      'This endpoint needs the Account ID in Hex format and returns the ICP balance of the specified account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdentityBalanceOutput,
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the User',
    type: String,
  })
  async getBalanceById(@Param('userId') userId: string) {
    return this.service.getBalance(userId);
  }

  // Transfer
  @Post('transfer')
  @ApiOperation({
    summary: 'Post transfer ICP',
    description:
      'This endpoint needs the credentials of To identities in Hex format, the amount that we want to transfer and an optional memo and it transfers the ICP and returns the information of the transaction',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdentityTransferOutput,
  })
  async transfer(
    @Param('userId') userId: string,
    @Body() input: IdentityTransferInput,
  ) {
    const transfer = await this.service.transfer(userId, input);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const transferFinal = await this.service.getTransferInfo(transfer);
    this.service.createTransferRecord(userId, transferFinal);
    return transferFinal;
  }

  // History
  @Post('history')
  @ApiOperation({
    summary: 'Get history of transactions by Account ID',
    description:
      'This endpoint needs the Account ID in Hex format and returns the history of transactions for that account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdentityHistoryOutput,
  })
  async getHistoryById(@Param('userId') userId: string) {
    return this.service.getHistory(userId);
  }
}
