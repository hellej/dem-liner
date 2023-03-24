import { useRef, useState } from "react";
import { useDEMPointsLayer } from "../DEMPointsLayer";
import { useDEMIsolineLayer } from "../DEMIsolineLayer";
import { useMapboxMap } from "../useMapboxMap";
import styles from "./MapApp.module.css";
import { ThresholdSlider } from "../ThresholdSlider/ThresholdSlider";

export const MapApp = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [threshold, setThreshold] = useState(5);
  const { map } = useMapboxMap(mapContainer);
  const { isLoaded: isLayerLoaded } = useDEMPointsLayer(map);

  return (
    <div className={styles["map-app-container"]}>
      <div className={styles["map-container"]} ref={mapContainer} />
      <div className={styles["map-overlay-container"]}>
        {!isLayerLoaded && "Loading layer..."}
        <ThresholdSlider threshold={threshold} setThreshold={setThreshold} />
      </div>
    </div>
  );
};
