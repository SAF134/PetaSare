import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import "./MapView.css"; // Import CSS untuk animasi popup
import { Hotel } from "@/data/hotels";

interface MapViewProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  highlightedHotelId: number | null;
  onHotelClick: (hotel: Hotel) => void;
}

// Custom marker icons based on category
const getMarkerIcon = (kategori: string, isHighlighted: boolean = false) => {
  const colors: Record<string, string> = {
    "HOTEL BINTANG 1": "#a8a29e", // stone-400
    "HOTEL BINTANG 2": "#78716c", // stone-500
    "HOTEL BINTANG 3": "#3b82f6", // blue-500
    "HOTEL BINTANG 4": "#fbbf24", // amber-400
    "HOTEL BINTANG 5": "#ef4444", // red-500
  };

  const color = colors[kategori] || "#94a3b8";
  const size = isHighlighted ? 40 : 32;
  
  // Ekstrak jumlah bintang dari kategori
  const starMatch = kategori.match(/\d+/);
  const starCount = starMatch ? parseInt(starMatch[0], 10) : 0;

  // Buat HTML untuk ikon bintang
  // Menggunakan flexbox untuk penataan yang lebih baik, terutama untuk 1-3 bintang
  const starsHtml = Array.from({ length: starCount }, () => `<span>★</span>`).join("");

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid ${isHighlighted ? '#f59e0b' : '#fff'};
        box-shadow: ${isHighlighted ? '0 0 20px rgba(255, 184, 107, 0.6)' : '0 2px 8px rgba(0,0,0,0.3)'};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      ">
        <div style="
          color: #FFD700; /* Warna Emas */
          font-size: ${starCount > 3 ? '10px' : '12px'};
          font-weight: bold;
          transform: rotate(45deg);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          line-height: 1;
        ">${starsHtml}</div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export const MapView = ({ hotels, selectedHotel, highlightedHotelId, onHotelClick }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      const map = L.map("map", {
        center: [-6.9175, 107.6191],
        zoom: 13,
        zoomControl: true,
      });

      const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      osm.addTo(map);

      // LAYAR GOOGLE MAPS
      const googlemaps = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
          maxZoom: 19,
          subdomains:['mt0','mt1','mt2','mt3']
      });
      googlemaps.addTo(map);

      // LAYAR SATELIT
      const satelit = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}',{
          maxZoom: 19,
          subdomains:['mt0','mt1','mt2','mt3']
      });
      satelit.addTo(map);

      const baseMaps = {
          "Open Street Map": osm,
          "Satelit": satelit,
          "Google Maps": googlemaps,
      };

      const layerControl = L.control.layers(baseMaps).addTo(map);

      // Initialize marker cluster group
      markerClusterRef.current = new L.MarkerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });

      map.addLayer(markerClusterRef.current);

      mapRef.current = map;
      // mark map as ready so any pending selectedHotel can be handled
      setMapReady(true);
    }

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerClusterRef.current) return;

    // Clear existing markers
    markerClusterRef.current.clearLayers();
    markersRef.current.clear();

    // Add new markers
    hotels.forEach((hotel) => {
      const isHighlighted = hotel.id === highlightedHotelId;
      const marker = L.marker([hotel.lat, hotel.lng], {
        icon: getMarkerIcon(hotel.kategori, isHighlighted),
      });

      const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(price);
      };

      marker.on("click", () => onHotelClick(hotel));

      markerClusterRef.current!.addLayer(marker);
      markersRef.current.set(hotel.id, marker);
    });

    // Set up global function for popup button (type assertion for window is necessary here)
    (window as Window & typeof globalThis & { viewHotelDetails: (hotelId: number) => void }).viewHotelDetails = (hotelId: number) => {
      const hotel = hotels.find((h) => h.id === hotelId);
      if (hotel) {
        onHotelClick(hotel);
      }
    };
  }, [hotels, highlightedHotelId, onHotelClick]);

  useEffect(() => {
    if (!mapRef.current || !selectedHotel || !mapReady) return;

    mapRef.current.setView([selectedHotel.lat, selectedHotel.lng], 20, {
      animate: true,
      duration: 0.5,
    });

    const marker = markersRef.current.get(selectedHotel.id);
    if (marker) {
      marker.openPopup();
    }
  }, [selectedHotel, mapReady]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Update marker icons when highlighted changes
    markersRef.current.forEach((marker, hotelId) => {
      const hotel = hotels.find((h) => h.id === hotelId);
      if (hotel) {
        const isHighlighted = hotelId === highlightedHotelId;
        marker.setIcon(getMarkerIcon(hotel.kategori, isHighlighted));
      }
    });
  }, [highlightedHotelId, hotels]);

  return (
    <div
      id="map"
      className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-border z-0"
      style={{ minHeight: "500px" }}
    />
  );
};
