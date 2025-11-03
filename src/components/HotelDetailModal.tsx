import { Hotel } from "@/data/hotels";
import TravelokaLogo from "@/assets/traveloka.png";
import AgodaLogo from "@/assets/agoda.png";
import GoogleMapsLogo from "@/assets/googlemaps.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  MapPin,
  Phone,
  Building2,
  Wifi,
  Snowflake,
  Car,
  UtensilsCrossed,
  Dumbbell,
  Waves,
  Sparkles,
  Plane,
  Briefcase,
  Martini,
  Bath,
  CigaretteOff,
  CookingPot,
  Accessibility,
  WashingMachine,
  Baby,
  ConciergeBell,
  LucideIcon,
  HelpCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface HotelDetailModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HotelDetailModal = ({ hotel, isOpen, onClose }: HotelDetailModalProps) => {
  if (!hotel) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const facilityIcons: Record<string, LucideIcon> = {
    "Wi-Fi gratis": Wifi,
    AC: Snowflake,
    "Parkir gratis": Car,
    "Parkir berbayar": Car,
    Restoran: UtensilsCrossed,
    "Pusat kebugaran": Dumbbell,
    "Kolam renang": Waves,
    "Kolam di dalam ruangan": Waves,
    "Kolam renang luar": Waves,
    Spa: Sparkles,
    "Jemputan bandara": Plane,
    "Pusat bisnis": Briefcase,
    Bar: Martini,
    "Bak air panas": Bath,
    "Bebas asap rokok": CigaretteOff,
    "Dapur di beberapa kamar": CookingPot,
    "Dapat diakses": Accessibility,
    "Layanan binatu": WashingMachine,
    "Cocok untuk anak-anak": Baby,
    "Layanan kamar": ConciergeBell,
    Sarapan: UtensilsCrossed,
    "Sarapan gratis": UtensilsCrossed,
    "Sarapan berbayar": UtensilsCrossed,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 gap-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 transition-all duration-300">
        <ScrollArea className="max-h-[90vh]">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Image */}
            <div className="relative md:h-full min-h-[300px]">
              <img
                src={hotel.gambar}
                alt={hotel.nama}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            {/* Right Column: Details */}
            <div className="p-6 md:p-8 flex flex-col">
              <DialogHeader className="mb-4">
                <Badge variant="secondary" className="text-sm font-medium w-fit mb-2">{hotel.kategori}</Badge>
                <DialogTitle className="text-3xl font-bold text-foreground">{hotel.nama}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-lg pt-1">
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span>{hotel.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">/ 5.0</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-muted-foreground text-sm flex-grow">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                  <p>{hotel.alamat}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                  <p>{hotel.kontak || "Tidak tersedia"}</p>
                </div>
              </div>

              <div className="my-6">
                <h4 className="font-semibold text-foreground mb-3 text-base">Fasilitas Unggulan</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {hotel.fasilitas.map((fasilitas, index) => {
                    const Icon = facilityIcons[fasilitas] || HelpCircle;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{fasilitas}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="my-4 p-4 bg-primary/10 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">Harga mulai dari</span>
                  <p className="text-2xl font-bold text-primary">{formatPrice(hotel.harga)}</p>
                </div>
                <span className="text-sm text-muted-foreground self-end">/ malam</span>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-3 text-base">Pemesanan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hotel.traveloka && (
                    <Button asChild variant="outline" className="justify-start transition-transform hover:scale-105 active:scale-95">
                      <a href={hotel.traveloka} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <img src={TravelokaLogo} alt="Traveloka" className="h-6 w-auto mr-2" /> Traveloka
                      </a>
                    </Button>
                  )}
                  {hotel.agoda && (
                    <Button asChild variant="outline" className="justify-start transition-transform hover:scale-105 active:scale-95">
                      <a href={hotel.agoda} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <img src={AgodaLogo} alt="Agoda" className="h-6 w-auto mr-2" /> Agoda
                      </a>
                    </Button>
                  )}
                </div>
                {hotel.peta && (
                  <Button asChild variant="default" className="w-full mt-3 transition-transform hover:scale-105 active:scale-95">
                    <a href={hotel.peta} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <img src={GoogleMapsLogo} alt="Google Maps" className="h-6 w-auto mr-2 rounded-sm" /> Google Maps
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};