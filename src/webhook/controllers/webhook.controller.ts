import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CRUD_BASE_CONFIG } from '../../shared/constants/crud';
import { Webhook } from '../entities/webhook.entity';
import { WebhookService } from '../services/webhook.service';

@Crud({
  model: {
    type: Webhook,
  },
  ...CRUD_BASE_CONFIG,
  routes: {
    ...CRUD_BASE_CONFIG.routes,
  },
})
@ApiTags('webhook')
@Controller('webhook')
export class WebhookController implements CrudController<Webhook> {
  constructor(public readonly service: WebhookService) {}
}
