import { useRef } from "react";
import { useDEMPointsLayer } from "../DEMPointsLayer/useDEMPointsLayer";
import { useMapboxMap } from "../useMapboxMap";
import styles from "./MapApp.module.css";

export const MapApp = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map } = useMapboxMap(mapContainer);
  const layerLoaded = useDEMPointsLayer(map);

  return (
    <div className={styles["map-app-container"]}>
      <div className={styles["map-container"]} ref={mapContainer} />
      <div className={styles["map-overlay-container"]}>
        {!layerLoaded && "Loading layer..."}
      </div>
    </div>
  );
};
