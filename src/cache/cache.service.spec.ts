import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('CacheService', () => {
  let cacheService: CacheService;
  let cache: Cache;

  // mock Services we are about to test
  const mockCacheManager = () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: CACHE_MANAGER, useFactory: mockCacheManager },
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
    cache = module.get<Cache>(CACHE_MANAGER);
    jest.resetAllMocks();
  });

  describe('get method', () => {
    it('should call cache manager with hash', async done => {
      const hashExample = '42311bbcc555b695cdff6c9df3ec2294';
      const cachedDataExample = `{
                status: 'OK',
                search: 'one search address', 
                location: 'one Location',
            }`;
      jest.spyOn(cache, 'get').mockResolvedValueOnce(cachedDataExample);
      await cacheService.get(hashExample);
      expect(cache.get).toBeCalledWith(hashExample);
      done();
    });

    it('should throw error with predefined messsage', async done => {
      const hashExample = '42311bbcc555b695cdff6c9df3ec2294';

      jest
        .spyOn(cache, 'get')
        .mockRejectedValueOnce(new Error('Something unexpected occurred!'));
      try {
        await cacheService.get(hashExample);
      } catch (error) {
        expect(error.message).toEqual(
          'An error ocurred while trying to get cached value:' +
            ' Error: Something unexpected occurred!',
        );
      }
      done();
    });
  });

  describe('set method', () => {
    const hashExample = '42311bbcc555b695cdff6c9df3ec2294';
    const cachedDataExample = `{
            status: 'OK';
            search: 'one search address'; 
            location: 'one Lpcation';
        }`;

    it('should set values for caching', async done => {
      jest.spyOn(cache, 'set').mockResolvedValueOnce({});
      await cacheService.set(hashExample, cachedDataExample);
      expect(cache.set).toBeCalledWith(hashExample, cachedDataExample);
      done();
    });

    it('should throw error with predefined messsage', async done => {
      const hashExample = '42311bbcc555b695cdff6c9df3ec2294';

      jest
        .spyOn(cache, 'set')
        .mockRejectedValueOnce(new Error('Something unexpected occurred!'));
      try {
        await cacheService.set(hashExample, cachedDataExample);
      } catch (error) {
        expect(error.message).toEqual(
          'An error ocurred while trying to set one value on cache:' +
            ' Error: Something unexpected occurred!',
        );
      }
      done();
    });
  });

  describe('delete method', () => {
    it('should delete specified key from cache', async done => {
      const hashExample = '42311bbcc555b695cdff6c9df3ec2294';

      jest.spyOn(cache, 'del').mockResolvedValueOnce({});
      await cacheService.delete(hashExample);
      expect(cache.del).toBeCalledWith(hashExample);
      done();
    });

    it('should throw error with predefined messsage', async done => {
      const hashExample = '42311bbcc555b695cdff6c9df3ec2294';

      jest
        .spyOn(cache, 'del')
        .mockRejectedValueOnce(new Error('Something unexpected occurred!'));
      try {
        await cacheService.delete(hashExample);
      } catch (error) {
        expect(error.message).toEqual(
          'An error ocurred while trying to delete cached value:' +
            ' Error: Something unexpected occurred!',
        );
      }
      done();
    });
  });

  describe('reset method', () => {
    it('should call cache manager with hash', async done => {
      jest.spyOn(cache, 'reset').mockResolvedValueOnce({});
      await cacheService.reset();
      expect(cache.reset).toHaveBeenCalled();
      done();
    });

    it('should throw error with predefined messsage', async done => {
      jest
        .spyOn(cache, 'reset')
        .mockRejectedValueOnce(new Error('Something unexpected occurred!'));
      try {
        await cacheService.reset();
      } catch (error) {
        expect(error.message).toEqual(
          'An error ocurred while trying to reset cache:' +
            ' Error: Something unexpected occurred!',
        );
      }
      done();
    });
  });
});
