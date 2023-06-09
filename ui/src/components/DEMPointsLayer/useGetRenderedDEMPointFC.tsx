import { Map, MapboxGeoJSONFeature } from "mapbox-gl";
import { Feature, FeatureCollection, Point } from "geojson";

export interface DEMPointProperties {
  elev: number;
}

export type DEMPointFeature = Feature<Point, DEMPointProperties> & {
  id: number;
};

export type DEMPointFC = FeatureCollection<Point, DEMPointProperties>;

const isNotUndefined = <T,>(v: T | undefined): v is T => v !== undefined;

const pointGeomAsStringIdentifier = (p: Point): string =>
  p.coordinates.map((c) => c.toFixed(6)).join("-");

const filterOutDuplicatePoints = (
  features: MapboxGeoJSONFeature[]
): MapboxGeoJSONFeature[] => {
  const geomIdentifiers = new Set();
  const uniqueFeatures = [];

  for (const feature of features) {
    const id = feature.id;
    if (geomIdentifiers.has(id)) continue;
    geomIdentifiers.add(id);
    uniqueFeatures.push(feature);
  }
  return uniqueFeatures;
};

const mapFeatureAsDEMPointFeature = (
  feat: MapboxGeoJSONFeature
): DEMPointFeature | undefined => {
  const elev = feat.properties?.elev;
  if (!elev || typeof elev !== "number") return undefined;
  if (typeof feat.id !== "number") return undefined;
  return {
    type: "Feature",
    geometry: feat.geometry as Point,
    properties: { elev },
    id: feat.id,
  };
};

export const useGetRenderedDEMPointFC = (
  map: Map | null,
  layerId: string
): (() => DEMPointFC) | undefined => {
  if (!map) return undefined;

  return () => {
    const mapFeatures = map.queryRenderedFeatures(undefined, {
      layers: [layerId],
    });

    return {
      type: "FeatureCollection",
      features: mapFeatures
        .map(mapFeatureAsDEMPointFeature)
        .filter(isNotUndefined),
    };
  };
};
