export interface IGeoCodingService {
  getGeoPointFromString(searchAddress: string): Promise<any>;
}
