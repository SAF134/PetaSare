import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import "./MapView.css"; // Import CSS untuk animasi popup
import { Hotel, hotels } from "@/data/hotels";
import { useLocation } from "@/contexts/LocationContext";
import { calculateDistance } from "@/lib/distance";
import { LocateFixed } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";

interface MapViewProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  highlightedHotelId: number | null;
  onHotelClick: (hotel: Hotel) => void;
  userLocation?: { lat: number; lng: number } | null;
  onUserLocationChange: (location: { lat: number; lng: number }) => void;
  onBoundsChange: (bounds: L.LatLngBounds) => void;
}

// Custom marker icons based on category
const getMarkerIcon = (kategori: string, isHighlighted: boolean = false): L.DivIcon => {
  const colors: Record<string, string> = {
    "HOTEL BINTANG 1": "hsl(220 15% 65%)", // muted-foreground
    "HOTEL BINTANG 2": "hsl(220 20% 95%)", // foreground
    "HOTEL BINTANG 3": "hsl(210 84% 62%)", // blue-500
    "HOTEL BINTANG 4": "hsl(48 96% 59%)", // yellow-400
    "HOTEL BINTANG 5": "hsl(var(--primary))", // primary
  };

  const color = colors[kategori] || "#94a3b8";
  const textColor = (kategori === "HOTEL BINTANG 2" || kategori === "HOTEL BINTANG 4") ? 'hsl(var(--background))' : 'hsl(var(--primary-foreground))';
  const size = isHighlighted ? 36 : 30;
  const shadow = isHighlighted ? '0 4px 12px hsla(var(--primary), 0.4)' : '0 2px 6px rgba(0,0,0,0.3)';
  const transform = isHighlighted ? 'scale(1.1)' : 'scale(1)';
  const zIndex = isHighlighted ? 1000 : 'auto';

  const starMatch = kategori.match(/\d+/);
  const starCount = starMatch ? parseInt(starMatch[0], 10) : 0;

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        color: ${textColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid ${isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--background))'};
        box-shadow: ${shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 700;
        transition: all 0.2s ease-in-out;
        transform: ${transform};
        z-index: ${zIndex};
      ">
        ${starCount}★
      </div>
    `,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Custom icon for user location
const userLocationIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-6 h-6 bg-blue-500 rounded-full animate-ping-slow opacity-50"></div>
      <div class="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
    </div>
  `,
  className: 'user-location-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export const MapView = ({ 
  hotels, 
  selectedHotel, 
  highlightedHotelId, 
  onHotelClick, 
  userLocation,
  onUserLocationChange,
  onBoundsChange
}: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const handleLocateUser = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
  };
  
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

      map.on('locationfound', (e) => {
        onUserLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.setLatLng(e.latlng);
        } else {
          userLocationMarkerRef.current = L.marker(e.latlng, { icon: userLocationIcon }).addTo(map);
        }
        toast.success("Lokasi ditemukan!");
      });

      map.on('locationerror', (e) => {
        toast.error("Gagal mendapatkan lokasi", {
          description: "Pastikan Anda telah memberikan izin akses lokasi untuk situs ini.",
        });
      });
      // --- Akhir Fitur Lokasi Pengguna ---

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
  }, [onUserLocationChange]);

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
  }, [hotels, highlightedHotelId, onHotelClick, userLocation, mapReady]);

  useEffect(() => {
    if (!mapRef.current || !selectedHotel || !mapReady) return;

    mapRef.current.setView([selectedHotel.lat, selectedHotel.lng], 20, {
      animate: true,
      duration: 0.5,
    });

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
    <div className="w-full h-full relative">
      <div
        id="map"
        className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-border z-0"
        style={{ minHeight: "500px" }}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-4 left-4 z-[1000] h-10 w-10 rounded-full shadow-lg"
            onClick={handleLocateUser}
          >
            <LocateFixed className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right"><p>Cari Lokasi Saya</p></TooltipContent>
      </Tooltip>
    </div>
  );
};