import { CacheService } from '../cache/cache.service';
import { IGeoCodingService } from '@providers/geo-coding.interface';
import { ServiceAreasRepository } from '@repo/service-areas.repository';
import { UrbanCoverageService } from './urban-coverage.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UrbanCoverageService', () => {
  let service: UrbanCoverageService;
  let redisCacheService: CacheService;
  let serviceAreaRepository: ServiceAreasRepository;
  let geoCodingService: IGeoCodingService;

  const mockGeoCodingService = () => ({
    getGeoPointFromString: jest.fn(),
  });

  const mockCacheService = () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    reset: jest.fn(),
  });

  const mockServiceAreasRepo = () => ({
    getDistrictFromPlace: jest.fn(),
  });

  const searchAddressNotFound = {
    status: 'NOT_FOUND',
    search: 'Non-existing address',
  };

  const cachedResponse = JSON.stringify({
    status: 'OK',
    search: 'one search address',
    location: 'one Location',
  });
  // mapped return from Api, to check full response geo-coding tests
  const geoPointFromStringResponse = {
    id: 'poi.300647815086',
    type: 'Feature',
    place_type: ['poi'],
    place_name:
      'Regent Street Cinema, 307 Regent St, London, England W1B 2HJ, United Kingdom',
    geometry: {
      coordinates: [-0.142657, 51.516852],
      type: 'Point',
    },
    context: [
      { id: 'postcode.17151441272249060', text: 'W1B 2HJ' },
      { id: 'place.10143138523886750', text: 'London' },
      {
        id: 'country.19678805456372290',
        short_code: 'gb',
        text: 'United Kingdom',
      },
    ],
  };

  const getDistrictFromPlaceResponse = {
    location: { coordinates: [[]], type: 'Polygon' },
    name: 'LONCENTRAL',
    _id: `5ff394da0b99964424d35ba0`,
    __v: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrbanCoverageService,
        {
          provide: 'GeoCodingService',
          useFactory: mockGeoCodingService,
        },
        {
          provide: CacheService,
          useFactory: mockCacheService,
        },
        {
          provide: ServiceAreasRepository,
          useFactory: mockServiceAreasRepo,
        },
      ],
    }).compile();

    service = module.get<UrbanCoverageService>(UrbanCoverageService);
    redisCacheService = module.get<CacheService>(CacheService);
    serviceAreaRepository = module.get<ServiceAreasRepository>(
      ServiceAreasRepository,
    );
    geoCodingService = module.get<IGeoCodingService>('GeoCodingService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached and parsed response', async done => {
    expect.assertions(2);
    jest.spyOn(redisCacheService, 'get').mockResolvedValueOnce(cachedResponse);
    const jsonParsedResponse = await service.searchAddress({
      searchAddress: 'one human-readable address',
    });
    expect(redisCacheService.get).toHaveBeenCalled();
    expect(jsonParsedResponse).toEqual(JSON.parse(cachedResponse));
    done();
  });

  it('should return not found if API returns undefined', async done => {
    expect.assertions(2);
    jest.spyOn(redisCacheService, 'get').mockResolvedValueOnce(undefined);
    jest
      .spyOn(geoCodingService, 'getGeoPointFromString')
      .mockResolvedValueOnce(undefined);
    const notFoundResponse = await service.searchAddress({
      searchAddress: 'one human-readable address',
    });
    expect(redisCacheService.get).toHaveBeenCalled();
    expect(notFoundResponse).toEqual(searchAddressNotFound);
    done();
  });

  it('should return not found if there is no district for address', async done => {
    expect.assertions(3);
    jest.spyOn(redisCacheService, 'get').mockResolvedValueOnce(undefined);
    jest
      .spyOn(geoCodingService, 'getGeoPointFromString')
      .mockResolvedValueOnce(geoPointFromStringResponse);
    jest
      .spyOn(serviceAreaRepository, 'getDistrictFromPlace')
      .mockResolvedValueOnce(undefined);
    const notFoundResponse = await service.searchAddress({
      searchAddress: 'one human-readable address',
    });
    expect(geoCodingService.getGeoPointFromString).toHaveBeenCalled();
    expect(serviceAreaRepository.getDistrictFromPlace).toHaveBeenCalledWith(
      geoPointFromStringResponse.geometry,
    );
    expect(notFoundResponse).toEqual(searchAddressNotFound);
    done();
  });

  it('should return final SearchResponse', async done => {
    const expectedResponse = {
      location: {
        address:
          'Regent Street Cinema, 307 Regent St, London, England W1B 2HJ, United Kingdom',
        city: 'London',
        lat: 51.516852,
        lng: -0.142657,
        postcode: 'W1B 2HJ',
        serviceArea: 'LONCENTRAL',
      },
      search: 'one human-readable address',
      status: 'OK',
    };
    expect.assertions(3);
    jest.spyOn(redisCacheService, 'get').mockResolvedValueOnce(undefined);
    jest
      .spyOn(geoCodingService, 'getGeoPointFromString')
      .mockResolvedValueOnce(geoPointFromStringResponse);
    jest
      .spyOn(serviceAreaRepository, 'getDistrictFromPlace')
      .mockResolvedValueOnce(getDistrictFromPlaceResponse);
    const fullResponse = await service.searchAddress({
      searchAddress: 'one human-readable address',
    });
    expect(geoCodingService.getGeoPointFromString).toHaveBeenCalled();
    expect(serviceAreaRepository.getDistrictFromPlace).toHaveBeenCalledWith(
      geoPointFromStringResponse.geometry,
    );
    expect(fullResponse).toEqual(expectedResponse);
    done();
  });

  it('should throw error with expected response', async done => {
    jest
      .spyOn(redisCacheService, 'get')
      .mockRejectedValueOnce(new Error('Something Unexpected'));
    try {
      await service.searchAddress({
        searchAddress: 'one human-readable address',
      });
    } catch (error) {
      expect(error.message).toEqual('INTERNAL_SERVER_ERROR');
    }
    done();
  });
});
