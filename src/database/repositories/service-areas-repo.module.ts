import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceAreaSchema } from '@schemas/service-areas.schema';
import { ServiceAreasRepository } from './service-areas.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ServiceArea', schema: ServiceAreaSchema },
    ]),
  ],
  providers: [ServiceAreasRepository],
  exports: [ServiceAreasRepository],
})
export class ServiceAreasRepoModule {}
