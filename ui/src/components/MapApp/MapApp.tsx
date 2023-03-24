import { useRef } from "react";
import { useDEMPointsLayer } from "../DEMPointsLayer";
import { useDEMIsolineLayer } from "../DEMIsolineLayer";
import { useMapboxMap } from "../useMapboxMap";
import styles from "./MapApp.module.css";
import { ThresholdSlider } from "../ThresholdSlider/ThresholdSlider";

export const MapApp = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { map } = useMapboxMap(mapContainer);
  const { isLoaded: isLayerLoaded, getRenderedDEMPointFC } =
    useDEMPointsLayer(map);

  const { updateDEMIsolines } = useDEMIsolineLayer(map);

  const handleGetRenderedDEMPointFC = () => {
    if (!getRenderedDEMPointFC) return;
    updateDEMIsolines(getRenderedDEMPointFC());
  };

  return (
    <div className={styles["map-app-container"]}>
      <div className={styles["map-container"]} ref={mapContainer} />
      <div className={styles["map-overlay-container"]}>
        {!isLayerLoaded && "Loading layer..."}
        <button onClick={handleGetRenderedDEMPointFC}>Query DEM point</button>
        <ThresholdSlider />
      </div>
    </div>
  );
};
