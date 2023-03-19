import { useMapboxMap } from "./useMapboxMap";
import styles from "./MapApp.module.css";

export const MapApp = () => {
  const { mapContainer } = useMapboxMap();
  return <div className={styles["map-container"]} ref={mapContainer} />;
};
