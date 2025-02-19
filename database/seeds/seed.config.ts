import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  runSeeders,
  SeederConstructor,
  SeederOptions,
} from 'typeorm-extension';

import UserFactory from '../factories/user.factory';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [__dirname + '/../../src/**/entities/*.entity.ts'],
  synchronize: false,
  logging: true,
  dropSchema: false,
  // additional config options brought by typeorm-extension
  factories: [UserFactory],
};

export const executeSeeder = async (seeds: SeederConstructor[] | string[]) => {
  const optionWithSeed = {
    ...options,
    seeds,
  };

  const dataSource = new DataSource(optionWithSeed);

  dataSource.initialize().then(async () => {
    await runSeeders(dataSource);
    process.exit();
  });
};
