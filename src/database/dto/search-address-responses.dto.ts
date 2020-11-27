import { MapBoxGeoCoordinates } from './mapbox-geo-coordinates.dto';
import { SearchAddressDTO } from './search-address-input.dto';
import { ServiceArea } from '@schemas/service-areas.schema';

class Location {
  address: string;
  city: string;
  lat: number;
  lng: number;
  serviceArea: string;
  postcode: string;

  constructor(
    placeGeoCoordinates: MapBoxGeoCoordinates,
    district: ServiceArea,
  ) {
    this.address = placeGeoCoordinates.place_name;
    this.city = this.getFeatureFromContext(
      placeGeoCoordinates.context,
      'place',
    );
    this.lat = placeGeoCoordinates.geometry.coordinates[1];
    this.lng = placeGeoCoordinates.geometry.coordinates[0];
    this.serviceArea = district.name;
    this.postcode = this.getFeatureFromContext(
      placeGeoCoordinates.context,
      'postcode',
    );
  }

  getFeatureFromContext(context: any[], feature: string) {
    const regex = new RegExp(`^${feature}.*$`, 'i');
    const cityFeature = context.find(el => el.id.match(regex));
    return cityFeature ? cityFeature.text.toString() : '';
  }
}

export class MapboxSearchResponse {
  status: string;
  search: string;
  location: Location;

  constructor(
    input: SearchAddressDTO,
    placeGeoCoordinates: MapBoxGeoCoordinates,
    district: ServiceArea,
  ) {
    this.status = 'OK';
    this.search = input.searchAddress;
    this.location = new Location(placeGeoCoordinates, district);
  }
}

export class SearchAddressNotFound {
  status: string;
  search: string;
  constructor() {
    this.status = 'NOT_FOUND';
    this.search = 'Non-existing address';
  }
}
