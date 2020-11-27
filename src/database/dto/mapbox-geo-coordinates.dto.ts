import { Contains } from 'class-validator';

export class PointDTO {
  @Contains('Point')
  type: string;
  coordinates: number[];
}

export class MapBoxGeoCoordinates {
  id: string;
  type: string;
  place_type: any[];
  relevance: number;
  properties: Record<string, unknown>;
  text: string;
  place_name: string;
  center: number[];
  geometry: PointDTO;
  context: any[];
}
