import * as crypto from 'crypto';
import { DistrictSeed } from '@dto/districts-seed.dto';
import { ServiceArea } from '@schemas/service-areas.schema';

/**
 * Description: This method returns one hash code containing 32 hex characters.
 *
 * Input: String containing a human readable address or postcode.
 */
export function generateHashFromAddress(searchAddress: string): string {
  try {
    // Trim whitespaces and convert address input to lowercase.
    const addressFromInput = searchAddress.trim().toLowerCase();
    // Transform full Address into small hash that will be used as
    // Cache key.
    return crypto
      .createHash('md5')
      .update(addressFromInput)
      .digest('hex');
  } catch (error) {
    throw new Error(
      `An error occurred whilst generating hash from address: ${error.message}`,
    );
  }
}

/**
 * Description: This method returns mapped array of urban districts.
 *
 * Input: Array of DistrictSeed objects.
 */
export function MapServiceAreaFromSeed(
  features: Array<DistrictSeed>,
): Array<ServiceArea> {
  try {
    return features.map(el => ({
      name: el.properties.Name,
      location: el.geometry,
    }));
  } catch (error) {
    throw new Error(
      `An error occurred whilst mapping ServiceArea from Seed: ${error.message}`,
    );
  }
}
