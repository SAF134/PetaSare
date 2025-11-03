import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, SlidersHorizontal, Building, Wallet, Star, ChevronDown } from "lucide-react";
import { FASILITAS_LIST } from "@/data/hotels";

export interface Filters {
  kategori: string;
  fasilitas: string[];
  harga: string;
  rating: string;
}

interface FilterPanelHorizontalProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
}

export const FilterPanelHorizontal = ({
  filters,
  onFiltersChange,
  onClear,
}: FilterPanelHorizontalProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const isScrolledToStart = el.scrollLeft <= 0;
      const isScrolledToEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setShowLeftShadow(!isScrolledToStart);
      setShowRightShadow(!isScrolledToEnd);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      handleScroll(); // Initial check
      el.addEventListener("scroll", handleScroll);
      const resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", handleScroll);
        resizeObserver.unobserve(el);
      };
    }
  }, [handleScroll]);

  const handleFilterChange = (key: keyof Filters, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleFasilitasChange = (fasilitas: string) => {
    const newFasilitas = filters.fasilitas.includes(fasilitas)
      ? filters.fasilitas.filter((f) => f !== fasilitas)
      : [...filters.fasilitas, fasilitas];
    handleFilterChange("fasilitas", newFasilitas);
  };

  const activeFiltersCount =
    (filters.kategori !== "all" ? 1 : 0) +
    filters.fasilitas.length +
    (filters.harga !== "all" ? 1 : 0) +
    (filters.rating !== "all" ? 1 : 0);

  return (
    <div className="relative">
      {/* Left Shadow */}
      <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 transition-opacity duration-300 pointer-events-none ${showLeftShadow ? 'opacity-100' : 'opacity-0'}`} />
      
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar"
      >
        {/* Kategori Filter */}
        <Select
          value={filters.kategori}
          onValueChange={(value) => handleFilterChange("kategori", value)}
        >
          <SelectTrigger className="w-auto min-w-[200px] flex-shrink-0 transition-all hover:scale-105 hover:border-primary/50 active:scale-95">
            <Building className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Kategori Hotel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="HOTEL BINTANG 1">Hotel Bintang 1</SelectItem>
            <SelectItem value="HOTEL BINTANG 2">Hotel Bintang 2</SelectItem>
            <SelectItem value="HOTEL BINTANG 3">Hotel Bintang 3</SelectItem>
            <SelectItem value="HOTEL BINTANG 4">Hotel Bintang 4</SelectItem>
            <SelectItem value="HOTEL BINTANG 5">Hotel Bintang 5</SelectItem>
          </SelectContent>
        </Select>

        {/* Harga Filter */}
        <Select value={filters.harga} onValueChange={(value) => handleFilterChange("harga", value)}>
          <SelectTrigger className="w-auto min-w-[200px] flex-shrink-0 transition-all hover:scale-105 hover:border-primary/50 active:scale-95">
            <Wallet className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Rentang Harga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Harga</SelectItem>
            <SelectItem value="200000">{"<"} Rp 200.000</SelectItem>
            <SelectItem value="400000">{"<"} Rp 400.000</SelectItem>
            <SelectItem value="600000">{"<"} Rp 600.000</SelectItem>
            <SelectItem value="800000">{"<"} Rp 800.000</SelectItem>
            <SelectItem value="1000000">{"<"} Rp 1.000.000</SelectItem>
            <SelectItem value="1000001">{">"} Rp 1.000.000</SelectItem>           
          </SelectContent>
        </Select>

        {/* Rating Filter */}
        <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
          <SelectTrigger className="w-auto min-w-[200px] flex-shrink-0 transition-all hover:scale-105 hover:border-primary/50 active:scale-95">
            <Star className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Rating</SelectItem>
            <SelectItem value="4.5">4.5+</SelectItem>
            <SelectItem value="4">4.0+</SelectItem>
            <SelectItem value="3.5">3.5+</SelectItem>
            <SelectItem value="3">3.0+</SelectItem>
          </SelectContent>
        </Select>

        {/* Fasilitas Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-auto min-w-[200px] flex-shrink-0 flex items-center justify-between transition-all hover:scale-105 hover:border-primary/50 active:scale-95">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <span className="flex-grow text-center">
                Fasilitas {filters.fasilitas.length > 0 && `(${filters.fasilitas.length})`}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <ScrollArea className="h-72">
              <div className="p-4 space-y-2">
                {FASILITAS_LIST.map((fasilitas) => (
                  <div key={fasilitas} className="flex items-center justify-between">
                    <label htmlFor={fasilitas} className="text-sm font-medium leading-none pr-2 cursor-pointer">
                      {fasilitas}
                    </label>
                    <Switch
                      id={fasilitas}
                      checked={filters.fasilitas.includes(fasilitas)}
                      onCheckedChange={() => handleFasilitasChange(fasilitas)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Clear Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={onClear}
            className="flex-shrink-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Reset ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Right Shadow */}
      <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 transition-opacity duration-300 pointer-events-none ${showRightShadow ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};