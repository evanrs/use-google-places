# use-google-places

[React hooks](https://reactjs.org/docs/hooks-intro.html) for the [Google Places API](https://developers.google.com/places/web-service/overview).

`yarn add use-google-places`

## Supported Methods

Currently limited to place predictions and details.

```typescript
import {
  useGooglePlacePredictions,
  useGooglePlaceDetails,
} from 'use-google-places-api'
```

### useGooglePlacePredictions

```typescript
function useGooglePlacePredictions(props: {
  /**
   * The GCP credential key with Google Places and Geocoding enabled
   */
  key: string;
  /**
   * The input to get predictions against
   */
  input?: string | null;
  /**
   * Constrains the results to the place type
   */
  type?: "geocode" | "address" | "establishment" | "(regions)" | "(cities)";
  /**
   * One or many ISO 3166-1 alpha-2 country codes
   */
  country?: string | string[];
  /**
   * Focus origin of predictions
   */
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  /**
   * Specifies radius for the geolocation of the prediction
   * @default 16,000 meters ~10 miles
   */
  radius?: number;
}): {
  input: string;
  results: google.maps.places.AutocompletePrediction[];
  status:
    | "INVALID_REQUEST"
    | "NOT_FOUND"
    | "OK"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "UNKNOWN_ERROR"
    | "ZERO_RESULTS"
};
```

### useGooglePlaceDetails

```typescript
function useGooglePlaceDetails(props: {
  /**
   * The GCP credential key with Google Places and Geocoding enabled
   */
  key: string;
  /**
   * The Google Place ID that uniquely identify a place
   * in the Google Places database and on Google Maps.
   */
  id?: string;
}): {
  id?: string;
  result?: google.maps.places.PlaceResult;
  status:
    | "INVALID_REQUEST"
    | "NOT_FOUND"
    | "OK"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "UNKNOWN_ERROR"
    | "ZERO_RESULTS"
};
```

## License

**[MIT](LICENSE)** Licensed
