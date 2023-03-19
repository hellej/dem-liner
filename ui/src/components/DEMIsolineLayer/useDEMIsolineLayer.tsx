import { GeoJSONSource, Map } from "mapbox-gl";
import isolines from "@turf/isolines";
import { FeatureCollection, MultiLineString } from "geojson";

import { DEMPointFC } from "../DEMPointsLayer";
import { mapUtils } from "@/utils";
import interpolate from "@turf/interpolate";

export type DEMIsolineFC = FeatureCollection<MultiLineString>;

const layerId = "dem-isolines";

const getDEMIsolines = (fc: DEMPointFC): DEMIsolineFC => {
  const breaks = [0.5, 1, 2, 3];
  return isolines(fc, breaks, { zProperty: "elev" });
};

const addSource = (map: Map, fc: DEMIsolineFC) => {
  map.addSource(layerId, {
    type: "geojson",
    data: fc,
  });
};

const addLayer = (map: Map) => {
  map.addLayer({
    id: layerId,
    type: "line",
    source: layerId,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "pink",
      "line-width": 4,
    },
  });
};

const useCreateOrUpdateMapLayer = (map: Map | null) => {
  return (fc: DEMIsolineFC) => {
    if (!map) return;
    if (!mapUtils.hasSource(map, layerId)) {
      addSource(map, fc);
    } else {
      (map.getSource(layerId) as GeoJSONSource).setData(fc);
    }
    if (!mapUtils.hasLayer(map, layerId)) {
      addLayer(map);
    }
  };
};

export const useDEMIsolineLayer = (
  map: Map | null
): { updateDEMIsolines: (fc: DEMPointFC) => void } => {
  const createOrUpdateMapLayer = useCreateOrUpdateMapLayer(map);

  const updateDEMIsolines = (pointFC: DEMPointFC) => {
    console.log("original points ", pointFC.features.length);
    console.log(
      "some heights:",
      pointFC.features.slice(10, 20).map((f) => f.properties.elev)
    );

    const pointGrid = interpolate(pointFC, 2, {
      gridType: "point",
      property: "elev",
      units: "meters",
    }) as DEMPointFC;
    console.log("pointGrid points ", pointGrid.features.length);

    const isolineFC = getDEMIsolines(pointGrid);

    console.log("isolineFC", isolineFC);
    createOrUpdateMapLayer(isolineFC);
  };

  return { updateDEMIsolines };
};
