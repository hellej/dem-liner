import { Map } from "mapbox-gl";

export const hasSource = (map: Map, sourceId: string): boolean => {
  try {
    return !!map.getSource(sourceId);
  } catch (e) {
    return false;
  }
};

export const hasLayer = (map: Map, layerId: string): boolean => {
  try {
    return !!map.getLayer(layerId);
  } catch (e) {
    return false;
  }
};
