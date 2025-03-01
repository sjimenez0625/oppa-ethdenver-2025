import { BaseRouteName } from '@dataui/crud';
import { ClassSerializerInterceptor } from '@nestjs/common';

import { Roles } from '../../auth/decorators/role.decorator';
import { ROLE } from '../../auth/constants/role.constant';

export const BASE_DECORATORS = [];
export const BASE_INTERCEPTORS = [ClassSerializerInterceptor];
export const BASE_ADMIN_DECORATORS = [...BASE_DECORATORS, Roles(ROLE.ADMIN)];
export const CRUD_ALL_ROUTES: BaseRouteName[] = [
  'getManyBase',
  'getOneBase',
  'createOneBase',
  'createManyBase',
  'updateOneBase',
  'replaceOneBase',
  'deleteOneBase',
];

export const CRUD_BASE_CONFIG = {
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    getManyBase: {
      decorators: BASE_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    getOneBase: {
      decorators: BASE_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    createOneBase: {
      decorators: BASE_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    createManyBase: {
      decorators: BASE_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    updateOneBase: {
      decorators: BASE_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    replaceOneBase: {
      decorators: BASE_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    deleteOneBase: {
      decorators: BASE_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
      returnDeleted: true,
    },
  },
};

export const CRUD_ADMIN_BASE_CONFIG = {
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    getManyBase: {
      decorators: BASE_ADMIN_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    getOneBase: {
      decorators: BASE_ADMIN_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    createOneBase: {
      decorators: BASE_ADMIN_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    createManyBase: {
      decorators: BASE_ADMIN_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    updateOneBase: {
      decorators: BASE_ADMIN_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    replaceOneBase: {
      decorators: BASE_ADMIN_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
    },
    deleteOneBase: {
      decorators: BASE_ADMIN_DECORATORS,
      interceptors: BASE_INTERCEPTORS,
      returnDeleted: true,
    },
  },
};
