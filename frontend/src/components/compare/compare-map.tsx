import "leaflet/dist/leaflet.css";

import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";

import { accentFor, type CompareSite } from "@/lib/compare-sites-data";

/** Read-only map showing every compared site with its positional accent colour. */
export default function CompareMap({ sites }: { sites: CompareSite[] }) {
  const center: [number, number] = sites.length
    ? [
        sites.reduce((s, x) => s + x.latitude, 0) / sites.length,
        sites.reduce((s, x) => s + x.longitude, 0) / sites.length,
      ]
    : [16.5, 78.8];

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={false}
      className="size-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {sites.map((site, index) => (
        <CircleMarker
          key={site.id}
          center={[site.latitude, site.longitude]}
          radius={9}
          pathOptions={{
            color: "white",
            weight: 2,
            fillColor: accentFor(index).color,
            fillOpacity: 1,
          }}
        >
          <Tooltip>
            Site {index + 1} — {site.city} ({site.suitability.toFixed(1)}/100)
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
