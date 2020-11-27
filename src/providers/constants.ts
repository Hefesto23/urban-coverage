export const MAPBOX_API_URL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/';
// Limit results to one or more countries. Permitted values are ISO 3166 alpha 2 country codes separated by commas.
export const MAPBOX_COUNTRY_CODE = 'gb';
// Limit results to only those contained within the supplied bounding box.
// Bounding boxes should be supplied as four numbers separated by commas,
// in minLon,minLat,maxLon,maxLat order
export const MAPBOX_BBOX = '-0.489,51.28,0.236,51.686';
// When autocomplete is enabled, results will be included that start with the
// requested string, rather than just responses that match it exactly.
// For example, a query for India might return both India and Indiana with
// autocomplete enabled, but only India if it’s disabled.
export const MAPBOX_AUTOCOMPLETE = 'true';
