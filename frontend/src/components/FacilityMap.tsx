"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl, { GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { INDIA_CENTER, type HeatPoint } from "@/lib/map-data";
import type { Facility } from "@/types/query";

type FacilityMapProps = {
  facilities: Facility[];
  title: string;
};

export function FacilityMap({ facilities, title }: FacilityMapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatPoint[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/heatmap_data.json")
      .then((response) => response.json())
      .then((rows: Array<{ lat: number; lon: number; intensity: number }>) => {
        if (!cancelled) {
          setHeatmapData(rows.filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lon)));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHeatmapData([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const markerGeoJson = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: facilities
        .map((facility) => {
          if (!Number.isFinite(facility.latitude) || !Number.isFinite(facility.longitude)) return null;
          return {
            type: "Feature" as const,
            properties: { title: facility.name },
            geometry: {
              type: "Point" as const,
              coordinates: [facility.longitude as number, facility.latitude as number],
            },
          };
        })
        .filter(Boolean),
    };
  }, [facilities]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: INDIA_CENTER,
      zoom: 4.3,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("desert-heat", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: heatmapData.map((point) => ({
            type: "Feature",
            properties: { intensity: point.intensity },
            geometry: {
              type: "Point",
              coordinates: [point.lon, point.lat],
            },
          })),
        },
      });

      map.addLayer({
        id: "desert-heat-layer",
        type: "heatmap",
        source: "desert-heat",
        paint: {
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.5, 9, 1.2],
          "heatmap-weight": ["get", "intensity"],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 12, 9, 25],
          "heatmap-opacity": 0.55,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "#67e8f9",
            0.4,
            "#facc15",
            0.6,
            "#fb923c",
            1,
            "#ef4444",
          ],
        },
      });

      map.addSource("facilities", {
        type: "geojson",
        data: markerGeoJson as GeoJSON.FeatureCollection,
      });

      map.addLayer({
        id: "facilities-layer",
        type: "circle",
        source: "facilities",
        paint: {
          "circle-radius": 7,
          "circle-color": "#0891b2",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      map.on("click", "facilities-layer", (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const coordinates = feature.geometry.coordinates.slice() as [number, number];
        const title = String(feature.properties?.title ?? "Facility");
        new maplibregl.Popup().setLngLat(coordinates).setHTML(`<strong>${title}</strong>`).addTo(map);
      });
    });

    mapRef.current = map;
    return () => map.remove();
  }, [heatmapData, markerGeoJson]);

  useEffect(() => {
    const source = mapRef.current?.getSource("facilities") as GeoJSONSource | undefined;
    if (!source) return;
    source.setData(markerGeoJson as GeoJSON.FeatureCollection);
  }, [markerGeoJson]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div ref={mapContainerRef} className="mt-3 h-[420px] w-full overflow-hidden rounded-xl" />
    </section>
  );
}
