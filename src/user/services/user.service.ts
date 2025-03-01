import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Identity } from '../entities/identity.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
  ) {
    super(repository);
  }

  async getUserById(
    userId: string,
    relations?: string[],
  ): Promise<User | null> {
    return this.repo.findOne({
      relations,
      where: { id: userId },
    });
  }

  async getIdentityByAccountId(accountId: string): Promise<Identity | null> {
    return this.identityRepository.findOne({
      where: { accountId: accountId },
    });
  }

  async patchUserById(
    userId: string,
    partial: DeepPartial<User>,
  ): Promise<User> {
    await this.repo.update(userId, partial);

    return this.repo.findOneOrFail({
      where: { id: userId },
    });
  }

  async validateEmailPassword(email: string, pass: string): Promise<User> {
    const user = await this.repo.findOne({
      where: { email },
    });

    if (!user) throw new Error('User not found');

    const match = await compare(pass, user.password);
    if (!match) throw new UnauthorizedException();

    return user;
  }
}
