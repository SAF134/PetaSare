import { Hotel } from "@/data/hotels";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Bookmark, MapPin, Wifi, Snowflake, Car, Waves, UtensilsCrossed, Dumbbell, LucideIcon } from "lucide-react";

interface HotelCardProps {
  isHighlighted: boolean;
  hotel: Hotel;
  onViewDetails: (hotel: Hotel) => void;
  onHighlight: (id: number | null) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onGoToMap: (hotel: Hotel) => void;
  distance?: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const keyFacilityIcons: Record<string, LucideIcon> = {
  "Wi-Fi gratis": Wifi,
  "AC": Snowflake,
  "Parkir gratis": Car,
  "Parkir berbayar": Car,
  "Kolam renang": Waves,
  "Kolam di dalam ruangan": Waves,
  "Kolam renang luar": Waves,
  "Restoran": UtensilsCrossed,
  "Pusat kebugaran": Dumbbell,
};

export const HotelCard = ({
  isHighlighted,
  hotel,
  onViewDetails,
  onHighlight,
  isBookmarked,
  onToggleBookmark,
  onGoToMap,
  distance,
}: HotelCardProps) => {
  // Ekstrak jumlah bintang dari kategori untuk ditampilkan sebagai ikon
  const starMatch = hotel.kategori.match(/\d+/);
  const starCount = starMatch ? parseInt(starMatch[0], 10) : 0;
  const starIcons = Array.from({ length: starCount }, (_, i) => (
    <Star key={i} className="h-4 w-4 fill-star-gold text-star-gold" />
  ));

  return (
    <Card
      className={`group overflow-hidden shadow-lg border hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full ${
        isHighlighted ? 'border-primary/80 border-2 shadow-primary/20' : 'border-border'
      }`}
      onMouseEnter={() => onHighlight(hotel.id)}
      onMouseLeave={() => onHighlight(null)}
    >
      <CardHeader className="p-0 relative">
        <div className="relative h-48 w-full">
          <img
            src={hotel.gambar}
            alt={hotel.nama}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onClick={() => onGoToMap(hotel)}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm p-2 rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(hotel.id);
                }}
              >
                <Bookmark
                  className={`h-5 w-5 text-primary transition-all ${isBookmarked ? "fill-current" : "fill-transparent"}`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left"><p>{isBookmarked ? "Hapus dari Bookmark" : "Tambahkan ke Bookmark"}</p></TooltipContent>
          </Tooltip>
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full p-4">
            <CardTitle className="text-lg font-bold text-white leading-tight">
              {hotel.nama}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-star-gold text-star-gold" />
            <span className="font-semibold text-foreground">{hotel.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">/ 5.0</span>
          </div>
          {starIcons.length > 0 && (
            <div className="flex items-center gap-0.5">{starIcons}</div>
          )}
        </div>
        {/* Key Facilities Icons */}
        <div className="flex items-center gap-2 mb-2">
          {hotel.fasilitas
            .filter(f => keyFacilityIcons[f]) // Filter for facilities with a defined icon
            .slice(0, 4) // Limit to 4 icons
            .map((fasilitas, index) => {
              const Icon = keyFacilityIcons[fasilitas];
              return (
                <div key={index} className="flex items-center text-muted-foreground" title={fasilitas}>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              );
            })}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          <MapPin className="inline-block h-4 w-4 mr-1" />
          {hotel.alamat}
        </p>
        {distance !== undefined && (
          <p className="text-sm text-primary font-semibold mt-2">
            {distance.toFixed(2)} km dari lokasi Anda
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-3">
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Harga mulai dari</p>
          <p className="text-xl font-bold text-primary">{formatPrice(hotel.harga)} <span className="text-sm text-muted-foreground">/ malam</span></p>
        </div>
        <Button
          onClick={() => onViewDetails(hotel)}
          className="w-full bg-primary hover:bg-primary/90 transition-all active:scale-95 hover:shadow-md hover:shadow-primary/30"
        >
          Lihat Selengkapnya
        </Button>
      </CardFooter>
    </Card>
  );
};