import { AxiosResponse } from 'axios';
import { GeoCodingMapboxService } from './geo-coding-mapbox.service';
import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';

jest.mock('./constants', () => ({
  MAPBOX_API_URL: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
  MAPBOX_COUNTRY_CODE: 'gb',
  MAPBOX_BBOX: '-0.489,51.28,0.236,51.686',
  MAPBOX_AUTOCOMPLETE: 'true',
}));

describe('GeoCodingMapboxService', () => {
  // Service we are using to spy
  const httpService = new HttpService();
  const geoService = new GeoCodingMapboxService(httpService);

  describe('getGeoPointFromString method', () => {
    // set env the variables
    process.env.MAPBOX_API_TOKEN = 'oneToken';

    // Correct Response Data
    const data = {
      features: [
        {
          id: 'poi.300647815086',
          type: 'Feature',
          place_type: ['poi'],
          relevance: 1,
          properties: {
            foursquare: '4f733006e4b0b7ca3b2ed910',
            landmark: true,
            address: 'Leonard St NW',
            category: 'bridge, man made',
          },
          text: 'Leonard St Bridge',
          place_name:
            'Leonard St Bridge, Leonard St NW, Grand Rapids, Michigan 49505, United States',
          center: [-85.673026, 42.984717],
          geometry: {
            coordinates: [-85.673026, 42.984717],
            type: 'Point',
          },
          context: [
            {
              id: 'neighborhood.2101683',
              text: 'Belknap Lookout',
            },
            { id: 'postcode.17151441272249060', text: '49505' },
            {
              id: 'place.10143138523886750',
              wikidata: 'Q184587',
              text: 'Grand Rapids',
            },
            {
              id: 'region.9469196105857470',
              wikidata: 'Q1166',
              short_code: 'US-MI',
              text: 'Michigan',
            },
            {
              id: 'country.19678805456372290',
              wikidata: 'Q30',
              short_code: 'us',
              text: 'United States',
            },
          ],
        },
      ],
    };
    // The whole axios response object
    const fullExpectedResponse: AxiosResponse<any> = {
      data,
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };

    // Response with data is empty
    const emptyResponse: AxiosResponse<any> = {
      data: {
        features: [],
      },
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 200,
      statusText: 'OK',
    };

    const errorResponse: AxiosResponse = {
      data: {
        name: 'TypeError',
        message: 'Something Unexpected Ocurred',
      },
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' },
      status: 500,
      statusText: 'Error',
    };

    it('should be called with specified url', async done => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(fullExpectedResponse));

      await geoService.getGeoPointFromString('One Address Example');
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
          'one%20address%20example.json?country=gb&' +
          'bbox=-0.489,51.28,0.236,51.686&autocomplete=true&' +
          'fuzzyMatch=false&access_token=oneToken',
      );
      done();
    });

    it('should return undefined if address has no match', async done => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(emptyResponse));

      const result = await geoService.getGeoPointFromString(
        'Address with no match',
      );
      expect(result).toBe(undefined);
      done();
    });

    it('should throw error if received data is diff than expected', async done => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(errorResponse));

      await expect(() =>
        geoService.getGeoPointFromString(''),
      ).rejects.toThrow();

      done();
    });
  });
});
