import { useDoOnce } from "@/hooks";
import { Map } from "mapbox-gl";
import { useCallback, useEffect, useState } from "react";
import {
  DEMPointFC,
  useGetRenderedDEMPointFC,
} from "./useGetRenderedDEMPointFC";

const layerURL = "mapbox://joose.2rotad4x";
const sourceLayerId = "points-2u14rd";

const layerId = "dem-points";

const useDEMPointFCOfCurrentExtent = (map: Map | null): DEMPointFC | null => {
  const [renderedDEMPointFC, setRenderedDEMPointFC] =
    useState<DEMPointFC | null>(null);
  const getRenderedDEMPointFC = useGetRenderedDEMPointFC(map, layerId);

  const updateRenderedDEMPointFC = () => {
    setRenderedDEMPointFC(
      getRenderedDEMPointFC ? getRenderedDEMPointFC() : null
    );
  };

  useEffect(() => {
    map?.on("moveend", updateRenderedDEMPointFC);
    return () => {
      map?.off("moveend", updateRenderedDEMPointFC);
    };
  });

  return renderedDEMPointFC;
};

const addSource = (map: Map) => {
  map.addSource(layerId, {
    type: "vector",
    url: layerURL,
    promoteId: { original: "id" },
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
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "isVisible"], false],
        0.8,
        0,
      ],
    },
  });
};

const useAddLayerToMap = (map: Map | null): boolean => {
  const sourceAdded = useDoOnce(map ? () => addSource(map) : undefined);
  const layerAdded = useDoOnce(map ? () => addLayer(map) : undefined);
  return sourceAdded && layerAdded;
};

const useUpdateStyleByThreshold = (map: Map | null, threshold: number) => {
  const demPointFC = useDEMPointFCOfCurrentExtent(map);

  useEffect(() => {
    if (!demPointFC || !map) return;

    map?.removeFeatureState({ source: layerId, sourceLayer: sourceLayerId });

    demPointFC.features.forEach((f) => {
      map.setFeatureState(
        { id: f.id, source: layerId, sourceLayer: sourceLayerId },
        { isVisible: f.properties.elev <= threshold }
      );
    });
  }, [map, threshold, demPointFC]);
};

export const useDEMPointsLayer = (
  map: Map | null,
  threshold: number
): {
  isLoaded: boolean;
  getRenderedDEMPointFC: (() => DEMPointFC) | undefined;
} => {
  const isLoaded = useAddLayerToMap(map);

  useUpdateStyleByThreshold(map, threshold);

  return {
    isLoaded,
    getRenderedDEMPointFC: useGetRenderedDEMPointFC(map, layerId),
  };
};
