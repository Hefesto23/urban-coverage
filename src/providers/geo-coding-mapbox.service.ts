import { IGeoCodingService } from './geo-coding.interface';
import { map } from 'rxjs/operators';
import { MapBoxGeoCoordinates } from './../database/dto/mapbox-geo-coordinates.dto';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import {
  MAPBOX_API_URL,
  MAPBOX_AUTOCOMPLETE,
  MAPBOX_BBOX,
  MAPBOX_COUNTRY_CODE,
} from './constants';

@Injectable()
export class GeoCodingMapboxService implements IGeoCodingService {
  private readonly logger = new Logger(GeoCodingMapboxService.name);
  constructor(private http: HttpService) {}

  /**
   * Description: This method returns Geo Coordinates and Address Features from a
   * given string.
   *
   * Input: String containing postcode or words of one specific address to be searched.
   */
  async getGeoPointFromString(
    searchAddress: string,
  ): Promise<MapBoxGeoCoordinates> {
    // The url that will be used to search for Addres
    // fuzzyMatch: Specify whether the Geocoding API should attempt approximate,
    // as well as exact, matching when performing searches (true, default), or
    // whether it should opt out of this behavior and only attempt exact matching (false).
    // For example, the default setting might return Washington, DC for a query of wahsington,
    // even though the query was misspelled.
    const geocoderUrl =
      `${MAPBOX_API_URL}${encodeURIComponent(searchAddress.toLowerCase())}` +
      `.json?country=${MAPBOX_COUNTRY_CODE}&bbox=${MAPBOX_BBOX}&` +
      `autocomplete=${MAPBOX_AUTOCOMPLETE}&fuzzyMatch=false&` +
      `access_token=${process.env.MAPBOX_API_TOKEN}`;

    return await this.http
      .get(geocoderUrl)
      .pipe(
        // Map Response to get only data we need.
        map(response => response.data.features[0]),
      )
      .toPromise()
      .catch(error => {
        this.logger.log(
          `An error ocurred when trying to
                     fetch GeoPoint from Mapbox API ${error}
                     with this url: ${geocoderUrl}`,
        );
        throw Error(error.message);
      });
  }
}
