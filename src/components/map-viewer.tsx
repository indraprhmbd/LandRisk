"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewerProps {
  center?: [number, number];
  zoom?: number;
  parcels?: any[];
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Fix for default marker icons in leaflet with webpack
function FixLeafletIcons() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);
  return null;
}

// Fit map bounds to show all markers
function FitBounds({ parcels }: { parcels?: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (parcels && parcels.length > 0) {
      const bounds = L.latLngBounds(
        parcels.map((p) => [p.latitude, p.longitude]),
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [parcels, map]);
  return null;
}

// Handle map clicks
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!onLocationSelect) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
}

function getRiskColor(classification: string): string {
  switch (classification) {
    case "Low":
      return "#22c55e";
    case "Moderate":
      return "#f59e0b";
    case "High":
      return "#ef4444";
    default:
      return "#888";
  }
}

export default function MapViewer({
  center = [-2.5489, 118.0149],
  zoom = 5,
  parcels = [],
  selectedLocation,
  onLocationSelect,
}: MapViewerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <FixLeafletIcons />
      <FitBounds parcels={parcels} />
      <MapClickHandler onLocationSelect={onLocationSelect} />

      {/* Dark map tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Selected location marker */}
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>
            <div className="text-xs space-y-1">
              <p className="font-semibold">Selected Location</p>
              <p className="font-mono">
                {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Parcel markers (if any) */}
      {parcels.map((parcel) => (
        <CircleMarker
          key={parcel.id}
          center={[parcel.latitude, parcel.longitude]}
          radius={8}
          pathOptions={{
            fillColor: getRiskColor(parcel.classification),
            color: getRiskColor(parcel.classification),
            fillOpacity: 0.7,
            weight: 2,
            opacity: 0.9,
          }}
        >
          <Popup>
            <div className="text-xs space-y-1 min-w-[180px]">
              <p className="font-semibold text-sm">{parcel.location_name}</p>
              <p>
                Risk: <strong>{parcel.risk_score.toFixed(1)}</strong> (
                {parcel.classification})
              </p>
              <p>Zoning: {parcel.zoning_category}</p>
              <p>Confidence: {(parcel.confidence_score * 100).toFixed(0)}%</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
