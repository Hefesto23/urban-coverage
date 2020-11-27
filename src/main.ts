import { AppModule } from './app.module';
import { features } from '@seeds/formatted-districts.json';
import { MapServiceAreaFromSeed } from '@utils/utils';
import { NestFactory } from '@nestjs/core';
import { ServiceAreasRepoModule } from '@repo/service-areas-repo.module';
import { ServiceAreasRepository } from '@repo/service-areas.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // First delete all rows from seed table
  // then seed data with seeder specified in ../seeds/ folder
  const repositoryServices = app
    .select(ServiceAreasRepoModule)
    .get(ServiceAreasRepository, { strict: true });
  await repositoryServices.clean();
  await repositoryServices.seed(MapServiceAreaFromSeed(features));
  // App will run in specified env port
  // if that value is empty then port 3000
  await app.listen(process.env.SERVER_PORT || 3000);
}
bootstrap();
