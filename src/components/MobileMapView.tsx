import { Button } from "./ui/button";
import { MapView } from "./MapView";
import { Hotel } from "@/data/hotels";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Map } from "lucide-react";

interface MobileMapViewProps {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  highlightedHotelId: number | null;
  onHotelClick: (hotel: Hotel) => void;
}

export const MobileMapView = ({
  hotels,
  selectedHotel,
  highlightedHotelId,
  onHotelClick,
}: MobileMapViewProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg flex items-center gap-2"
        >
          <Map className="h-5 w-5"/>
          <span>Tampilkan Peta</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[80%] p-0">
        <div className="h-full w-full">
          <MapView
            hotels={hotels}
            selectedHotel={selectedHotel}
            highlightedHotelId={highlightedHotelId}
            onHotelClick={onHotelClick}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};