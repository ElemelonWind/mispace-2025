import { MapContainer, ImageOverlay, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const bounds = [
  [41.0, -92.0],   // SW corner (approx Great Lakes bounding box)
  [49.0, -74.0]    // NE corner
];

function IceMap({ day }) {
  const overlayUrl = `/forecast_day_${day}.png`;
  const shippingGeoJSON = "/shipping_routes.geojson";

  const shippingStyle = {
    color: "red",
    weight: 2
  };

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <ImageOverlay url={overlayUrl} bounds={bounds} opacity={0.8} />

      <GeoJSON data={require("../public/shipping_routes.geojson")}
        style={shippingStyle}
      />
    </MapContainer>
  );
}

export default IceMap;
