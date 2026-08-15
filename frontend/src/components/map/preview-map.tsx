import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { Circle, CircleMarker, MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";

import { heatPoints, mapSites, suitabilityColor } from "@/lib/map-explorer-data";

/**
 * Lightweight, read-only map preview for the Dashboard "Map" tab.
 * Reuses the Map Explorer data layer — no controls, layers or search here.
 */
const selectedIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="oklch(0.55 0.19 258)" stroke="white" stroke-width="1.4"><path d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="11" r="2.6" fill="white" stroke="none"/></svg>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function PreviewMap({
  latitude,
  longitude,
  label,
}: {
  latitude: number;
  longitude: number;
  label: string;
}) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={9}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
      doubleClickZoom={false}
      className="size-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {heatPoints.map((p, i) => (
        <Circle
          key={`preview-heat-${i}`}
          center={[p.lat, p.lng]}
          radius={p.radius}
          pathOptions={{ stroke: false, fillColor: suitabilityColor(p.score), fillOpacity: 0.16 }}
          interactive={false}
        />
      ))}

      {mapSites.slice(0, 14).map((s) => (
        <CircleMarker
          key={`preview-${s.id}`}
          center={[s.lat, s.lng]}
          radius={5}
          pathOptions={{
            color: "white",
            weight: 1.5,
            fillColor: suitabilityColor(s.score),
            fillOpacity: 0.95,
          }}
          interactive={false}
        />
      ))}

      <CircleMarker
        center={[latitude, longitude]}
        radius={14}
        pathOptions={{
          color: "oklch(0.55 0.19 258)",
          weight: 2,
          fillColor: "oklch(0.55 0.19 258)",
          fillOpacity: 0.14,
        }}
        interactive={false}
      />
      <Marker position={[latitude, longitude]} icon={selectedIcon}>
        <Tooltip permanent direction="bottom" offset={[0, 4]} className="font-semibold">
          {label}
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}
