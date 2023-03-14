import Head from "next/head";
import styles from "@roadies/styles/Home.module.css";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { isLatLonValid } from "@roadies/utils/isStateValid";
import getSummary from "@roadies/utils/getSummary";

type Input = {
  lat: string;
  lon: string;
  message: string;
  isValid: boolean;
};

export default function Home() {
  const handleInputChange = (state: Input, newState: Input): Input => {
    if (isLatLonValid(newState?.lat, newState?.lon)) {
      return {
        lat: newState.lat,
        lon: newState.lon,
        message:
          newState?.message == "gps"
            ? "Got from your location 👍"
            : "Valid fr 💯",
        isValid: true,
      };
    } else {
      const lat = parseFloat(newState.lat);
      const lon = parseFloat(newState.lon);
      let error;
      if (newState.lat == "" && newState.lon == "") {
        error = "Enter the values";
      } else if (!newState.lat) {
        error = "Now enter Latitude value";
      } else if (newState?.lat && isNaN(lat)) {
        error = "Invalid Latitude";
      } else if (!newState.lon) {
        error = "Now enter Longitude value";
      } else if (newState?.lon && isNaN(lon)) {
        error = "Invalid Longitude";
      } else {
        error = "Invalid values";
      }
      return {
        lat: newState.lat,
        lon: newState.lon,
        message: error,
        isValid: false,
      };
    }
  };

  const params = useRouter().query;
  const [state, setState] = useReducer(handleInputChange, {
    lat: params?.["lat"] as string,
    lon: params?.["lon"] as string,
    message: "Enter the values",
    isValid: false,
  });

  const onSuccessfullLocation = (position: GeolocationPosition) => {
    setState({
      lat: position?.coords?.latitude?.toString(),
      lon: position?.coords?.longitude?.toString(),
      message: "gps",
      isValid: false,
    });
  };

  const onLossLocation = (error: any) => {
    alert("Could'nt get you location.");
  };

  const {
    data,
    isLoading,
    refetch: fetchQuality,
  } = useQuery(
    [state.lat, state.lon],
    async () =>
      (await axios.get(`/api/current?lat=${state?.lat}&lon=${state?.lon}`)).data
        ?.data,
    {
      enabled: false,
      onError: (e: any) => alert(e.response?.data?.["message"]),
    }
  );
  console.log(data);
  return (
    <>
      <Head>
        <title>Air quality</title>
        <meta name="description" content="Know how the air is" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <form
          className={styles.card}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {state?.message !== "" && (
            <h3
              style={{
                margin: "0px",
                color: state?.isValid ? "green" : "red",
              }}
            >
              {state.message}
            </h3>
          )}
          <div>
            <label
              style={{ padding: "5px", lineHeight: "2.5em" }}
              htmlFor="lat"
            >
              Latitude
            </label>
            <br />
            <input
              id="lat"
              className={styles.input}
              value={state.lat}
              onChange={(e) => setState({ ...state, lat: e.target.value })}
              placeholder="Enter Latitude"
            />
          </div>
          <div>
            <label
              style={{ padding: "5px", lineHeight: "2.5em" }}
              htmlFor="lon"
            >
              Longitude
            </label>
            <br />
            <input
              id="lon"
              className={styles.input}
              value={state.lon}
              onChange={(e) => setState({ ...state, lon: e.target.value })}
              placeholder="Enter Longitude"
            />
          </div>
          Or, You can give access to your location
          <button
            className={styles.button}
            onClick={() => {
              typeof navigator !== "undefined" &&
                navigator.geolocation.getCurrentPosition(
                  onSuccessfullLocation,
                  onLossLocation
                );
            }}
          >
            Give my location
          </button>
          <hr
            style={{
              border: "1px solid black",
              width: "100%",
            }}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={!state?.isValid || isLoading}
            onClick={() => fetchQuality()}
          >
            {isLoading ? "Loading..." : "Get Air Quality"}
          </button>
        </form>
        {data && (
          <div
            className={styles.card}
            style={{
              flex: "1",
              maxWidth: "300px",
              height: "100%",
              opacity: state?.isValid ? "1" : "0.5",
              pointerEvents: state?.isValid ? "all" : "none",
            }}
          >
            <div>
              <h3>{isLoading ? "Loading..." : "Air Quality"}</h3>
              <p>
                In {data?.city_name}, the air quality index is{" "}
                <strong>{data?.data?.[0]?.aqi}</strong>.
              </p>
              <p>That means: {getSummary(data?.data?.[0]?.aqi as number)}</p>
              <h4>Other Details:</h4>
              <ul>
                {Object.keys(data?.data?.[0])?.map(
                  (k) =>
                    k !== "aqi" && (
                      <li>
                        {k?.split("_").join(" ")}: {data?.data?.[0]?.[k]}
                      </li>
                    )
                )}
              </ul>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
