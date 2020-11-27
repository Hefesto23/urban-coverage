import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';
import { CacheModule, Module } from '@nestjs/common';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: parseInt(process.env.REDIS_TTL),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class GereralCacheModule {}
