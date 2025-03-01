import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import { setSeederFactory } from 'typeorm-extension';

import { User } from '../../src/user/entities/user.entity';

export default setSeederFactory(User, async () => {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: await hash(faker.internet.password(), 10),
    dob: faker.date.past({
      years: faker.helpers.rangeToNumber({ min: 18, max: 65 }),
    }),
    roles: ['user'],
    isAccountDisabled: false,
    authId: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
});
