import { MutableRefObject, useEffect, useRef, useState } from "react";
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

export const useMapboxMap = (): {
  map: Map | null;
  mapContainer: MutableRefObject<HTMLDivElement>;
} => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapObject = useRef<null | mapboxgl.Map>(null);

  useEffect(() => {
    if (mapObject.current) return;
    mapObject.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: MapboxBasemap.SATELLITE,
      center: [24.820204, 60.189515],
      zoom: 12,
    });
  });

  return {
    map: mapObject.current,
    mapContainer: mapContainer as MutableRefObject<HTMLDivElement>,
  };
};
