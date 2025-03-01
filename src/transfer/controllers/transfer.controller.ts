import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CRUD_BASE_CONFIG } from '../../shared/constants/crud';
import { Transfer } from '../entities/transfer.entity';
import { TransferService } from '../services/transfer.service';

@Crud({
  model: {
    type: Transfer,
  },
  ...CRUD_BASE_CONFIG,
  routes: {
    only: ['getOneBase'],
    ...CRUD_BASE_CONFIG.routes,
  },
})
@ApiTags('transfer')
@Controller('transfer')
export class TransferController implements CrudController<Transfer> {
  constructor(public readonly service: TransferService) {}
}
