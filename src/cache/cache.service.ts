import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  /**
   * Description: This method returns the value of key.
   *
   * Input: string containing a key.
   */
  async get(key: string): Promise<string> {
    return await this.cache.get(key).catch(error => {
      throw new Error(
        `An error ocurred while trying to` + ` get cached value: ${error}`,
      );
    });
  }

  /**
   * Description: Set key to hold the string value.
   * If key already holds a value, it is overwritten, regardless of its type.
   *
   * Input: string containing a key and any string value.
   */
  async set(key: string, value: string): Promise<void> {
    await this.cache.set(key, value).catch(error => {
      throw new Error(
        `An error ocurred while trying to` +
          ` set one value on cache: ${error}`,
      );
    });
  }

  /**
   * Description: Removes the specified keys. A key is ignored if it does not exist.
   *
   * Input: string containing a key.
   */
  async delete(key: string): Promise<void> {
    await this.cache.del(key).catch(error => {
      this.logger.log(error);
      throw new Error(
        `An error ocurred while trying to` + ` delete cached value: ${error}`,
      );
    });
  }

  /**
   * Description: Clear the entire cache.
   *
   */
  async reset(): Promise<void> {
    await this.cache.reset().catch(error => {
      throw new Error(
        `An error ocurred while trying to` + ` reset cache: ${error}`,
      );
    });
  }
}
