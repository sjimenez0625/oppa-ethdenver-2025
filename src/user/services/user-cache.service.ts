import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CacheService } from '../../shared/services/cache.service';
import { CACHE_KEY } from '../../shared/constants/cache';

@Injectable()
export class UserCacheService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) repository: Repository<User>,
    private readonly cacheService: CacheService,
  ) {
    super(repository);
  }

  async getUsersByIds(userIds: string[]): Promise<User[]> {
    const usersFound: string[] = [];
    const userIdsToFetch: string[] = [];
    const users: User[] = [];

    for (const userId of userIds) {
      if (userIdsToFetch.includes(userId) || usersFound.includes(userId))
        continue;

      const user = await this.cacheService.get<User>(CACHE_KEY.USER, {
        id: userId,
      });
      if (user) {
        users.push(user);
        usersFound.push(userId);
      } else {
        userIdsToFetch.push(userId);
      }
    }

    if (userIdsToFetch.length === 0) return users;

    const usersFetched = await this.repo.find({
      where: {
        id: In(userIdsToFetch),
      },
    });

    for (const user of usersFetched) {
      await this.cacheService.set(CACHE_KEY.USER, user, {
        id: user.id,
      });
    }

    return users.concat(usersFetched);
  }
}
