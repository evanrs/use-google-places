import { useContext, useEffect, useMemo } from "react";
import { useLatestVersion } from "use-latest-version";
import { nanoid } from "nanoid";

import {
  GooglePlacePredictionsResult,
  GooglePlacePrediction,
  GooglePlaceType,
  Status,
} from "./types";
import { TypedResponse } from "./tools";
import { context } from "./context";

// TODO implement origin
// TODO implement language
export type UseGooglePlacePredictionsProps = {
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
  type?: GooglePlaceType;
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
};

type Response = TypedResponse<PlacePredictionsData>;
type PlacePredictionsData = {
  predictions: GooglePlacePrediction[];
  status: Status;
};

const defaults = {
  get prediction(): GooglePlacePredictionsResult {
    return {
      input: "",
      results: [],
      status: "OK",
    };
  },
};

export function useGooglePlacePredictions(props: UseGooglePlacePredictionsProps) {
  const { key, input, type, country, geolocation, radius } = props;
  const { fetch } = useContext(context);

  const session = useMemo(nanoid, []);
  const url = useMemo(() => {
    if (input) {
      const query = [
        `key=${key}`,
        `input=${encodeURIComponent(input)}`,
        session && `sessiontoken=${session}`,
        type && `types=${type}`,
        country &&
          `components=${([] as string[])
            .concat(country)
            .map((id) => `country:${id}`)
            .join("|")}`,
        geolocation && `location=${geolocation.latitude},${geolocation?.longitude}`,
        radius != null && `radius=${radius}`,
      ].filter(Boolean);

      return `https://maps.googleapis.com/maps/api/place/autocomplete/json?${query.join("&")}`;
    }
  }, [key, input, session, type, country, geolocation?.latitude, geolocation?.longitude, radius]);

  const [request, setRequest] = useLatestVersion<{ input: string; response: Response } | null>(
    null,
    [url],
  );
  const [prediction, setPrediction] = useLatestVersion(defaults.prediction, [url]);

  useEffect(() => {
    if (!url) {
      setPrediction(defaults.prediction);
      return;
    }

    let mounted = true;

    fetch<PlacePredictionsData>(url, {}).then(async (response) => {
      if (mounted) {
        // TODO check response status;
        setRequest({ input: input as string, response });
      }
    });

    return () => {
      mounted = false;
    };
  }, [url]);

  useEffect(() => {
    request.value?.response?.json().then((data) => {
      setPrediction({
        input: request.value?.input as string,
        results: data.predictions,
        status: data.status,
      });
    });
  }, [request.version]);

  return prediction.value;
}
