import { Contains } from 'class-validator';

export class PropertiesSeed {
  Description: string;
  Name: string;
}

export class GeometrySeed {
  @Contains('Polygon')
  type: string;
  coordinates: number[][][];
}

export class DistrictSeed {
  @Contains('Polygon')
  type: string;

  properties: PropertiesSeed;

  geometry: GeometrySeed;
}
