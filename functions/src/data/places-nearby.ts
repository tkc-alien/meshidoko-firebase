/**
 * PlacesAPIのラッピング
 */

import * as lib from "@googlemaps/google-maps-services-js";

export type PlacePhoto = Pick<lib.PlacePhoto, "photo_reference">;

export type AddressGeometry = Pick<lib.AddressGeometry, "location">;

export type PlacesNearbyRequest = lib.PlacesNearbyRequest;

export type PlaceData = {
  place_id: string;
  name: string;
  geometry: AddressGeometry;
  photos: PlacePhoto[];
  price_level: number;
};

export type Place = Partial<PlaceData>;

export type PlacesNearbyResponseData = Omit<
  lib.PlacesNearbyResponseData,
  "results"
> & {
  results: Place[];
};

export type PlacesNearbyResponse = Pick<lib.PlacesNearbyResponse, "status"> & {
  data: PlacesNearbyResponseData;
};

/** APIクライアント */
const client = new lib.Client({
  config: {
    validateStatus: (_) => true,
    raxConfig: { retry: 3, retryDelay: 300 },
  },
});

export const placesNearby = (
  request: PlacesNearbyRequest
): Promise<PlacesNearbyResponse> => {
  return client.placesNearby(request);
};
