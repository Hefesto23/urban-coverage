import { GeoCodingServiceModule } from '@providers/geo-coding.module';
import { GereralCacheModule } from '@cache/cache.module';
import { Module } from '@nestjs/common';
import { ServiceAreasRepoModule } from '@repo/service-areas-repo.module';
import { UrbanCoverageController } from './urban-coverage.controller';
import { UrbanCoverageService } from './urban-coverage.service';

@Module({
  imports: [ServiceAreasRepoModule, GeoCodingServiceModule, GereralCacheModule],
  providers: [UrbanCoverageService],
  controllers: [UrbanCoverageController],
})
export class UrbanCoverageModule {}
