import { CacheService } from '@cache/cache.service';
import { generateHashFromAddress } from '@utils/utils';
import { IGeoCodingService } from '@providers/geo-coding.interface';
import { MapBoxGeoCoordinates } from '@dto/mapbox-geo-coordinates.dto';
import { SearchAddressDTO } from '@dto/search-address-input.dto';
import { ServiceArea } from '@schemas/service-areas.schema';
import { ServiceAreasRepository } from '@repo/service-areas.repository';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  MapboxSearchResponse,
  SearchAddressNotFound,
} from '@dto/search-address-responses.dto';

@Injectable()
export class UrbanCoverageService {
  private readonly logger = new Logger(UrbanCoverageService.name);
  constructor(
    @Inject('GeoCodingService')
    private readonly geoCodingService: IGeoCodingService,
    private readonly redisCacheService: CacheService,
    private readonly serviceAreaRepository: ServiceAreasRepository,
  ) {}

  /**
   * Description: This method returns a structure that describes one location.
   * The response contains latitude, longitude, service area, city,
   * full address and postcode.
   *
   * Input: String containing postcode or words of one specific address to be searched.
   */
  async searchAddress(userInput: SearchAddressDTO): Promise<any> {
    // declaring variables first
    const searchNotFound = new SearchAddressNotFound();
    let hashFromAddress: string;
    let cachedResponse: string;
    let placeGeoFeatures: MapBoxGeoCoordinates;
    let district: ServiceArea;
    let searchAddressResponse: MapboxSearchResponse;

    this.logger.log(`Get Service area for Address: ${userInput.searchAddress}`);
    try {
      // return 32 hasehd hex characters from any given address text.
      hashFromAddress = generateHashFromAddress(userInput.searchAddress);
      // First check in the cache if there is already one response for this address
      cachedResponse = await this.redisCacheService.get(hashFromAddress);

      // If not start search process
      if (!cachedResponse) {
        this.logger.log('Using Api Data...');

        // Get informations about the address from Api.
        placeGeoFeatures = await this.geoCodingService.getGeoPointFromString(
          userInput.searchAddress,
        );

        // If Api returns features then ...
        if (placeGeoFeatures) {
          // ... check if there is one district for the address ...
          district = await this.serviceAreaRepository.getDistrictFromPlace(
            placeGeoFeatures.geometry,
          );

          if (district) {
            //... If so, build response
            searchAddressResponse = new MapboxSearchResponse(
              userInput,
              placeGeoFeatures,
              district,
            );
            // add the information in the cache
            await this.redisCacheService.set(
              hashFromAddress,
              JSON.stringify(searchAddressResponse),
            );

            return searchAddressResponse;
          }
        }
        //For all other possibilities return not found.
        return searchNotFound;
      } else {
        this.logger.log('Using cached Data...');
        // return cached response
        return JSON.parse(cachedResponse);
      }
    } catch (error) {
      this.logger.log(`Error Message: ${error.message}`);
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
