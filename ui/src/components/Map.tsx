import { MutableRefObject, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./Map.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const useMapboxMap = (): MutableRefObject<HTMLDivElement> => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapObject = useRef<null | mapboxgl.Map>(null);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    throw new Error("Missing process.env.NEXT_PUBLIC_MAPBOX_TOKEN");
  }

  useEffect(() => {
    if (mapObject.current) return;
    mapObject.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [24.820204, 60.189515],
      zoom: 12,
    });
  });

  return mapContainer as MutableRefObject<HTMLDivElement>;
};

export const Map = () => {
  const mapContainer = useMapboxMap();
  return <div className={styles["map-container"]} ref={mapContainer} />;
};
