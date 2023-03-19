import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  throw new Error("Missing process.env.NEXT_PUBLIC_MAPBOX_TOKEN");
} else {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
}

export enum MapboxBasemap {
  STREETS = "mapbox://styles/mapbox/streets-v12",
  DARK = "mapbox://styles/mapbox/dark-v11",
  SATELLITE = "mapbox://styles/mapbox/satellite-v9",
}

const useMapReady = (map: Map | null): boolean => {
  const [isReady, setIsReady] = useState(false);
  const setReady = useCallback(() => setIsReady(true), []);

  useEffect(() => {
    map?.on("load", setReady);
    return () => {
      map?.off("load", setReady);
    };
  }, [map, setReady]);

  return isReady;
};

const createMap = (container: HTMLDivElement): Map => {
  return new mapboxgl.Map({
    container,
    style: MapboxBasemap.SATELLITE,
    center: [24.820204, 60.189515],
    zoom: 12,
  });
};

export const useMapboxMap = (
  mapContainer: MutableRefObject<HTMLDivElement | null>
): {
  map: Map | null;
} => {
  const [map, setMap] = useState<null | mapboxgl.Map>(null);
  const initialized = useRef<boolean>(false);
  const mapIsReady = useMapReady(map);

  useEffect(() => {
    if (initialized.current || !mapContainer.current) return;
    initialized.current = true;
    setMap(createMap(mapContainer.current));
  }, [map, mapContainer]);

  return {
    map: mapIsReady ? map : null,
  };
};
