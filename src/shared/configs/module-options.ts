import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from 'joi';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().optional(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    AUTH0_DOMAIN: Joi.string().required(),
    AUTH0_AUDIENCE: Joi.string().required(),
    SENTRY_DSN: Joi.string().optional(),
    SENTRY_ENVIRONMENT: Joi.string().required(),
    NEW_RELIC_APP_NAME: Joi.string().required(),
    NEW_RELIC_LICENSE_KEY: Joi.string().required(),
    NEW_RELIC_LABELS: Joi.string().required(),
    REDIS_URL: Joi.string().required(),
    REDIS_PASSWORD: Joi.string().empty(''),
    REDIS_NAMESPACE: Joi.string().default('NAMESPACE'),
  }),
};
