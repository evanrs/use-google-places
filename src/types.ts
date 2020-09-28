export type GooglePlaceType =
  // Instructs the Place Autocomplete service to return only geocoding results, rather than business results.
  // Generally, you use this request to disambiguate results where the location specified may be indeterminate.
  | "geocode"
  // Instructs the Place Autocomplete service to return only geocoding results with a precise address.
  // Generally, you use this request when you know the user will be looking for a fully specified address.
  | "address"
  // Instructs the Place Autocomplete service to return only business results.
  | "establishment"
  // The (regions) type collection instructs the Places service to return any result matching the following types
  | "(regions)"
  // The (cities) type collection instructs the Places service to return results that match locality or administrative_area_level_3.
  | "(cities)";

export type Status =
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "OK"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR"
  | "ZERO_RESULTS"
  // custom … but also, unused
  // TODO use a loading value?
  | "LOADING";

export type GooglePlacePrediction = google.maps.places.AutocompletePrediction;
export type GooglePlaceDetails = google.maps.places.PlaceResult;
export type GoogleGeocoderAddressComponent = google.maps.GeocoderAddressComponent;

export type GooglePlacePredictionsResult = {
  input: string;
  results: GooglePlacePrediction[];
  status: Status;
};

export type GooglePlaceDetailsResult = {
  id?: string;
  result?: GooglePlaceDetails;
  status: Status;
};
