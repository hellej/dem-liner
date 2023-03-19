import { useDoOnce } from "@/hooks";
import { Map } from "mapbox-gl";
import {
  DEMPointFC,
  useGetRenderedDEMPointFC,
} from "./useGetRenderedDEMPointFC";

const layerURL = "mapbox://joose.8a3p02oc";
const sourceLayerId = "points-al0av9";

const layerId = "dem-points";

const addSource = (map: Map) => {
  map.addSource(layerId, {
    type: "vector",
    url: layerURL,
  });
};

const addLayer = (map: Map) => {
  map.addLayer({
    id: layerId,
    source: layerId,
    "source-layer": sourceLayerId,
    type: "circle",
    paint: {
      "circle-radius": 1.2,
      "circle-color": "white",
      "circle-opacity": 0.5,
    },
  });
};

const useAddLayerToMap = (map: Map | null): boolean => {
  const sourceAdded = useDoOnce(map ? () => addSource(map) : undefined);
  const layerAdded = useDoOnce(map ? () => addLayer(map) : undefined);
  return sourceAdded && layerAdded;
};

export const useDEMPointsLayer = (
  map: Map | null
): {
  isLoaded: boolean;
  getRenderedDEMPointFC: (() => DEMPointFC) | undefined;
} => {
  const isLoaded = useAddLayerToMap(map);
  const getRenderedDEMPointFC = useGetRenderedDEMPointFC(map, layerId);

  return { isLoaded, getRenderedDEMPointFC };
};
