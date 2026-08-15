import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { Circle, CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";

import {
  heatPoints,
  infrastructureLines,
  mapSites,
  protectedAreas,
  selectedSite,
  suitabilityColor,
  waterBodies,
  windPoints,
  type LayerId,
} from "@/lib/map-explorer-data";

const selectedIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="oklch(0.55 0.19 258)" stroke="white" stroke-width="1.4"><path d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="11" r="2.6" fill="white" stroke="none"/></svg>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.6"><path d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="11" r="2.4" fill="white" stroke="none"/></svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });

const turbineIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="oklch(0.63 0.14 245)" stroke-width="1.8" stroke-linecap="round"><path d="M12 22v-9"/><path d="M12 13 4 9"/><path d="m12 13 8-4"/><path d="M12 13V3"/><circle cx="12" cy="13" r="1.4" fill="oklch(0.63 0.14 245)"/></svg>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

const substationIcon = L.divIcon({
  className: "",
  html: `<span style="display:grid;place-items:center;width:22px;height:22px;border-radius:9999px;background:oklch(0.96 0.03 300);border:1.5px solid oklch(0.6 0.19 300)"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="oklch(0.6 0.19 300)"><path d="M13 2 3 14h7l-1 8 11-13h-7z"/></svg></span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

/** Imperative zoom / fit controls rendered as a leaflet-styled overlay. */
function MapControls({ onLayersClick }: { onLayersClick: () => void }) {
  const map = useMap();

  const fit = () => {
    map.setView([selectedSite.latitude, selectedSite.longitude], 10);
    map.invalidateSize();
  };

  const btn =
    "grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-muted";

  return (
    <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
      <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
        <button type="button" aria-label="Zoom in" className="grid size-9 place-items-center hover:bg-muted" onClick={() => map.zoomIn()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <span className="h-px bg-border" />
        <button type="button" aria-label="Zoom out" className="grid size-9 place-items-center hover:bg-muted" onClick={() => map.zoomOut()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>
        </button>
      </div>
      <button type="button" aria-label="Fit view to site" className={btn} onClick={fit}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" /></svg>
      </button>
      <button type="button" aria-label="Toggle map layers" className={btn} onClick={onLayersClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></svg>
      </button>
    </div>
  );
}

/** Keeps the map centred when the selected analysis changes. */
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], map.getZoom(), { animate: false });
  return null;
}

export default function ExplorerMap({
  latitude,
  longitude,
  label,
  active,
  onLayersClick,
}: {
  latitude: number;
  longitude: number;
  label: string;
  active: Record<LayerId, boolean>;
  onLayersClick: () => void;
}) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      minZoom={4}
      scrollWheelZoom
      zoomControl={false}
      className="size-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {active.terrain ? (
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          opacity={0.18}
          attribution="&copy; OpenTopoMap"
        />
      ) : null}

      {active.heatmap
        ? heatPoints.map((p, i) => (
            <Circle
              key={`heat-${i}`}
              center={[p.lat, p.lng]}
              radius={p.radius}
              pathOptions={{
                stroke: false,
                fillColor: suitabilityColor(p.score),
                fillOpacity: 0.16,
              }}
              interactive={false}
            />
          ))
        : null}

      {active.water
        ? waterBodies.map((w) => (
            <Circle
              key={w.id}
              center={[w.lat, w.lng]}
              radius={w.radius}
              pathOptions={{ color: "oklch(0.6 0.12 235)", weight: 1, fillColor: "oklch(0.72 0.11 235)", fillOpacity: 0.35 }}
              interactive={false}
            />
          ))
        : null}

      {active.protected
        ? protectedAreas.map((p) => (
            <Circle
              key={p.id}
              center={[p.lat, p.lng]}
              radius={p.radius}
              pathOptions={{ color: "oklch(0.58 0.14 150)", weight: 1.5, dashArray: "5 4", fillColor: "oklch(0.7 0.13 150)", fillOpacity: 0.16 }}
              interactive={false}
            />
          ))
        : null}

      {active.infrastructure
        ? infrastructureLines.map((line, i) => (
            <Polyline
              key={`infra-${i}`}
              positions={line}
              pathOptions={{ color: "oklch(0.62 0.05 260)", weight: 2, dashArray: "6 5", opacity: 0.7 }}
              interactive={false}
            />
          ))
        : null}

      {active.solar
        ? mapSites
            .filter((s) => s.kind === "solar")
            .map((s) => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={pinIcon(suitabilityColor(s.score))}>
                <Tooltip>Solar site · Score {s.score}</Tooltip>
              </Marker>
            ))
        : null}

      {active.wind
        ? [...mapSites.filter((s) => s.kind === "wind"), ...windPoints].map((s) => (
            <Marker key={`w-${s.id}`} position={[s.lat, s.lng]} icon={turbineIcon}>
              <Tooltip>Wind site · Score {s.score}</Tooltip>
            </Marker>
          ))
        : null}

      {active.substations
        ? mapSites
            .filter((s) => s.kind === "substation")
            .map((s) => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={substationIcon}>
                <Tooltip>Grid substation</Tooltip>
              </Marker>
            ))
        : null}

      <CircleMarker
        center={[latitude, longitude]}
        radius={16}
        pathOptions={{ color: "oklch(0.55 0.19 258)", weight: 2, fillColor: "oklch(0.55 0.19 258)", fillOpacity: 0.14 }}
        interactive={false}
      />
      <Marker position={[latitude, longitude]} icon={selectedIcon}>
        <Tooltip permanent direction="bottom" offset={[0, 4]} className="font-semibold">
          {label}
        </Tooltip>
      </Marker>

      <Recenter lat={latitude} lng={longitude} />
      <MapControls onLayersClick={onLayersClick} />
    </MapContainer>
  );
}
