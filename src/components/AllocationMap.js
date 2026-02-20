import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import barangays from "../data/barangays";

// Fix Leaflet default icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Build coordinates lookup
const barangayCoordinates = {};
barangays.forEach((b) => {
  barangayCoordinates[b.name.toLowerCase().trim()] = [b.lat, b.lng];
});

// Status icons
const icons = {
  done: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  pending: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
};

// Fly helper
function MapFly({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15);
  }, [position, map]);
  return null;
}

function AllocationMap({ allocations = [], flyToBrgy }) {
  const flyPosition =
    flyToBrgy &&
    barangayCoordinates[flyToBrgy.toLowerCase().trim()];

  return (
    <MapContainer
      key={allocations.length} // force refresh when allocations change
      center={[14.045, 121.433]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {flyPosition && <MapFly position={flyPosition} />}

      {allocations.map((alloc) => {
        if (!alloc.barangay) return null;

        const position =
          barangayCoordinates[alloc.barangay.toLowerCase().trim()];
        if (!position) return null;

        const icon = alloc.distributed ? icons.done : icons.pending;

        return (
          <Marker key={alloc.id} position={position} icon={icon}>
            <Popup>
              <strong>{alloc.barangay}</strong>
              <br />
              Quantity: {alloc.allocated_quantity}
              <br />
              Status: {alloc.distributed ? "Done" : "Pending"}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default AllocationMap;