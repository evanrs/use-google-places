import { useContext, useEffect, useMemo } from "react";
import { useLatestVersion } from "use-latest-version";
import { nanoid } from "nanoid/non-secure";

import { GooglePlaceDetails, GooglePlaceDetailsResult, Status } from "./types";
import { TypedResponse } from "./tools";
import { context } from "./context";

export type UseGooglePlaceDetailsProps = {
  /**
   * The GCP credential key with Google Places and Geocoding enabled
   */
  key: string;
  /**
   * The Google Place ID that uniquely identify a place
   * in the Google Places database and on Google Maps.
   */
  id?: string;
  // TODO language, region, sessiontoken, fields
  // https://developers.google.com/places/web-service/details
};

type Response = TypedResponse<GooglePlaceDetailsData>;
type GooglePlaceDetailsData = {
  result: GooglePlaceDetails;
  status: Status;
};

const defaults = {
  get details(): GooglePlaceDetailsResult {
    return {
      status: "OK",
    };
  },
};

export function useGooglePlaceDetails({ key, id }: UseGooglePlaceDetailsProps) {
  const { fetch } = useContext(context);

  const session = useMemo(nanoid, []);
  const url = useMemo(() => {
    if (id) {
      const query = [`key=${key}`, `place_id=${id}`].filter(Boolean);

      return `https://maps.googleapis.com/maps/api/place/details/json?${query.join("&")}`;
    }
  }, [key, id, session]);

  const [request, setRequest] = useLatestVersion<{ id: string; response: Response } | null>(null, [
    url,
  ]);
  const [details, setDetails] = useLatestVersion(defaults.details, [url]);

  useEffect(() => {
    if (!url) {
      setDetails(defaults.details);
      return;
    }

    let mounted = true;

    fetch<GooglePlaceDetailsData>(url, {}).then(async (response) => {
      if (mounted) {
        setRequest({ id: id as string, response });
      }
    });

    return () => {
      mounted = false;
    };
  }, [url]);

  useEffect(() => {
    request.value?.response?.json().then((data) => {
      setDetails({
        id: request.value?.id,
        result: data.result,
        status: data.status,
      });
    });
  }, [request.version]);

  return details.value;
}
