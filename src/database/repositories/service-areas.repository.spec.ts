import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceAreasRepository } from './service-areas.repository';
import {
  ServiceArea,
  ServiceAreaDocument,
} from '@schemas/service-areas.schema';
import { Test, TestingModule } from '@nestjs/testing';

describe('ServiceAreasRepository', () => {
  let serviceAreasRepository: ServiceAreasRepository;
  let serviceAreaModel: Model<ServiceAreaDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceAreasRepository,
        {
          provide: getModelToken(ServiceArea.name),
          useValue: {
            insertMany: jest.fn(),
            deleteMany: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    serviceAreasRepository = module.get<ServiceAreasRepository>(
      ServiceAreasRepository,
    );
    serviceAreaModel = module.get<Model<ServiceAreaDocument>>(
      getModelToken(ServiceArea.name),
    );
    jest.resetAllMocks();
  });

  describe('seed method', () => {
    const feedExample: Array<ServiceArea> = [
      {
        name: 'UK-BRISTOL',
        location: {
          type: 'Polygon',
          coordinates: [[[-2.574288015879176, 51.45810002889328, 0]]],
        },
      },
    ];

    it('expect repository to be called with input', async done => {
      jest.spyOn(serviceAreaModel, 'insertMany').mockResolvedValue(null);
      await serviceAreasRepository.seed(feedExample);
      expect(serviceAreaModel.insertMany).toHaveBeenCalledWith(feedExample);
      done();
    });

    it('expect to throw error with predefined message', async done => {
      jest
        .spyOn(serviceAreaModel, 'insertMany')
        .mockRejectedValueOnce(new Error('Something unexpected!'));
      try {
        await serviceAreasRepository.seed(feedExample);
      } catch (error) {
        expect(error.message).toEqual(
          'An error ocurred while trying to' +
            ' seed district table with this error: Something unexpected!',
        );
      }

      done();
    });
  });

  describe('clean method', () => {
    it('expect repository to be called', async done => {
      jest.spyOn(serviceAreaModel, 'deleteMany').mockResolvedValue(null);
      await serviceAreasRepository.clean();
      expect(serviceAreaModel.deleteMany).toHaveBeenCalled();
      done();
    });

    it('expect to throw error with predefined message', async done => {
      jest
        .spyOn(serviceAreaModel, 'deleteMany')
        .mockRejectedValueOnce(new Error('Something unexpected!'));
      try {
        await serviceAreasRepository.clean();
      } catch (error) {
        expect(error.message).toEqual(
          `An error ocurred while trying ` +
            `to clean seed table with this error: Something unexpected!`,
        );
      }

      done();
    });
  });

  describe('getDistrictFromPlace method', () => {
    const pointExample = {
      coordinates: [-85.673026, 42.984717],
      type: 'Point',
    };

    const findOneInput = {
      location: {
        $geoIntersects: {
          $geometry: pointExample,
        },
      },
    };

    it('expect repository to be called with input', async done => {
      jest.spyOn(serviceAreaModel, 'findOne').mockResolvedValue(null);
      await serviceAreasRepository.getDistrictFromPlace(pointExample);
      expect(serviceAreaModel.findOne).toHaveBeenCalledWith(findOneInput);
      done();
    });

    it('expect to throw error with predefined message', async done => {
      jest
        .spyOn(serviceAreaModel, 'findOne')
        .mockRejectedValueOnce(new Error('Something unexpected!'));
      try {
        await serviceAreasRepository.getDistrictFromPlace(pointExample);
      } catch (error) {
        expect(error.message).toEqual(
          'An error ocurred while trying to' +
            ' geointersect point to find district with this error: Something unexpected!',
        );
      }

      done();
    });
  });
});
