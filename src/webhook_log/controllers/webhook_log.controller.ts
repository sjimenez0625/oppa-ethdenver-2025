import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CRUD_BASE_CONFIG } from '../../shared/constants/crud';
import { WebhookLog } from '../entities/webhook_log.entity';
import { WebhookLogService } from '../services/webhook_log.service';

@Crud({
  model: {
    type: WebhookLog,
  },
  ...CRUD_BASE_CONFIG,
  routes: {
    ...CRUD_BASE_CONFIG.routes,
  },
})
@ApiTags('webhook_log')
@Controller('webhook_log')
export class WebhookLogController implements CrudController<WebhookLog> {
  constructor(public readonly service: WebhookLogService) {}
}
