import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PointDTO } from '@dto/mapbox-geo-coordinates.dto';
import { Injectable, Logger } from '@nestjs/common';
import {
  ServiceArea,
  ServiceAreaDocument,
} from '@schemas/service-areas.schema';

@Injectable()
export class ServiceAreasRepository {
  private readonly logger = new Logger(ServiceAreasRepository.name);
  constructor(
    @InjectModel(ServiceArea.name)
    private serviceAreaModel: Model<ServiceAreaDocument>,
  ) {}

  /**
   * Description: This method feeds the DB with all urban districts.
   *
   * Input: Array of ServiceArea objects.
   */
  async seed(serviceAreas: Array<ServiceArea>): Promise<void> {
    await this.serviceAreaModel.insertMany(serviceAreas).catch(error => {
      throw new Error(
        `An error ocurred while trying to` +
          ` seed district table with this error: ${error.message}`,
      );
    });
  }

  /**
   * Description: This method delete all rows of Service area DB.
   *
   */
  async clean(): Promise<void> {
    await this.serviceAreaModel.deleteMany({}).catch(error => {
      throw new Error(
        `An error ocurred while trying ` +
          `to clean seed table with this error: ${error.message}`,
      );
    });
  }

  /**
   * Description: This method returns mapped array of urban districts.
   *
   * Input: Array of DistrictSeed objects.
   */
  async getDistrictFromPlace(point: PointDTO): Promise<ServiceArea> {
    return await this.serviceAreaModel
      .findOne({
        location: {
          $geoIntersects: { $geometry: point },
        },
      })
      .catch(error => {
        throw new Error(
          `An error ocurred while trying to ` +
            `geointersect point to find district with this error: ${error.message}`,
        );
      });
  }
}
