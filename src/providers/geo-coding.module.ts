import { GeoCodingMapboxService } from './geo-coding-mapbox.service';
import { HttpModule, Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'GeoCodingService',
      useClass: GeoCodingMapboxService,
    },
  ],
  exports: [
    {
      provide: 'GeoCodingService',
      useClass: GeoCodingMapboxService,
    },
  ],
})
export class GeoCodingServiceModule {}
