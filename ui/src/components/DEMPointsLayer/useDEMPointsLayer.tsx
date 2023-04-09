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

  let delayedUpdate: undefined | ReturnType<typeof setTimeout> = undefined;

  const updateRenderedDEMPointFC = (e: any) => {
    if (delayedUpdate) {
      clearTimeout(delayedUpdate);
    }
    setRenderedDEMPointFC(
      getRenderedDEMPointFC ? getRenderedDEMPointFC() : null
    );
    delayedUpdate = setTimeout(() => {
      console.log("updating FC of current extent", e);
      setRenderedDEMPointFC(
        getRenderedDEMPointFC ? getRenderedDEMPointFC() : null
      );
    }, 2000);
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

const useUpdateStyleByThreshold = (
  map: Map | null,
  threshold: number,
  demPointFC: DEMPointFC | null
) => {
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

const useDebugClickedFeature = (map: Map | null) => {
  const handleClick = useCallback(
    (e: any) => {
      const bbox = [
        [e.point.x - 3, e.point.y - 3],
        [e.point.x + 3, e.point.y + 3],
      ];
      const selectedFeatures = map?.queryRenderedFeatures(bbox as any, {
        layers: [layerId],
      });
      console.log("clicked features", selectedFeatures);
    },
    [map]
  );

  useEffect(() => {
    map?.on("click", handleClick);
    return () => {
      map?.off("click", handleClick);
    };
  });
};

export const useDEMPointsLayer = (
  map: Map | null,
  threshold: number
): {
  isLoaded: boolean;
  demPointFC: DEMPointFC | null;
} => {
  const isLoaded = useAddLayerToMap(map);
  const demPointFC = useDEMPointFCOfCurrentExtent(map);

  useDebugClickedFeature(map);
  useUpdateStyleByThreshold(map, threshold, demPointFC);

  return {
    isLoaded,
    demPointFC,
  };
};
