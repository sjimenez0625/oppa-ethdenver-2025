import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CacheService } from '../../shared/services/cache.service';
import { CACHE_KEY } from '../../shared/constants/cache';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    private readonly cacheService: CacheService,
  ) {
    super(repository);
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.repo.findOneBy({
      id: userId,
    });
  }

  async patchUserById(
    userId: string,
    partial: DeepPartial<User>,
    clearCache: boolean = false,
  ): Promise<User> {
    await this.repo.update(userId, partial);

    if (clearCache) {
      await this.cacheService.del(CACHE_KEY.USER, { id: userId });
    }

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
