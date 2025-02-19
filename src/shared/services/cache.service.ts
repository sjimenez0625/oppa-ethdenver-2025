import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_KEY } from '../constants/cache';

@Injectable()
export class CacheService {
  private readonly DEFAULT_TTL = 60 * 60; // 1 hour

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private replaceKeyInjection(
    key: CACHE_KEY,
    keyInject?: Record<string, string>,
  ) {
    let localkey: string = key;
    if (keyInject) {
      localkey = localkey.replace(/\*(\w+)/g, (match, p1) => keyInject[p1]);
    }

    return localkey;
  }

  async get<T>(
    key: CACHE_KEY,
    keyInject?: Record<string, string>,
  ): Promise<T | null> {
    const localKey = this.replaceKeyInjection(key, keyInject);

    return this.cacheManager.get<T>(localKey);
  }

  async set(
    key: CACHE_KEY,
    value: any,
    keyInject?: Record<string, string>,
    ttl = this.DEFAULT_TTL,
  ) {
    const localKey = this.replaceKeyInjection(key, keyInject);

    return this.cacheManager.set(localKey, value, { ttl } as any);
  }

  async getOrSet(
    key: CACHE_KEY,
    fn: () => Promise<any>,
    keyInject?: Record<string, string>,
    ttl = this.DEFAULT_TTL,
  ) {
    const localKey = this.replaceKeyInjection(key, keyInject);

    const value = await this.cacheManager.get(localKey);

    if (value) return value;

    const data = await fn();
    await this.cacheManager.set(localKey, data, { ttl } as any);

    return data;
  }

  async del(key: CACHE_KEY, keyInject?: Record<string, string>) {
    const localKey = this.replaceKeyInjection(key, keyInject);

    return this.cacheManager.set(localKey, null, { ttl: 1 } as any);
  }
}
