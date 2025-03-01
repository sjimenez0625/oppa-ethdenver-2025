import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { executeSeeder } from './seed.config';

export default class SampleSeeder implements Seeder {
  public async run(
    _dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {}
}

executeSeeder([SampleSeeder]);
