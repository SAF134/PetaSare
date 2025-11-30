import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, Trash2, ArrowDownUp, Star, Building2, Wallet, Sparkles } from "lucide-react";
import { FASILITAS_LIST } from "@/data/hotels";

export interface Filters {
  kategori: string;
  fasilitas: string[];
  harga: string;
  rating: string;
}

export type DistanceSort = 'none' | 'nearest' | 'farthest';

interface FilterPanelHorizontalProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
  distanceSort: DistanceSort;
  onDistanceSortChange: (sort: DistanceSort) => void;
  isLocationAvailable: boolean;
}

export const FilterPanelHorizontal = ({
  filters,
  onFiltersChange,
  onClear,
  distanceSort,
  onDistanceSortChange,
  isLocationAvailable,
}: FilterPanelHorizontalProps) => {
  const isMobile = useIsMobile();
  const handleFilterChange = (type: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [type]: value });
  };

  const handleFasilitasChange = (fasilitas: string) => {
    const newFasilitas = filters.fasilitas.includes(fasilitas)
      ? filters.fasilitas.filter((f) => f !== fasilitas)
      : [...filters.fasilitas, fasilitas];
    onFiltersChange({ ...filters, fasilitas: newFasilitas });
  };

  const filterOptions = {
    kategori: [
      { value: "all", label: "Semua Bintang" },
      { value: "HOTEL BINTANG 5", label: "Bintang 5" },
      { value: "HOTEL BINTANG 4", label: "Bintang 4" },
      { value: "HOTEL BINTANG 3", label: "Bintang 3" },
      { value: "HOTEL BINTANG 2", label: "Bintang 2" },
      { value: "HOTEL BINTANG 1", label: "Bintang 1" },
    ],
    harga: [
      { value: "all", label: "Semua Harga" },
      { value: "200000", label: "<= Rp 200.000" },
      { value: "400000", label: "<= Rp 400.000" },
      { value: "600000", label: "<= Rp 600.000" },
      { value: "800000", label: "<= Rp 800.000" },
      { value: "1000000", label: "<= Rp 1.000.000" },
      { value: "over1000000", label: "> Rp 1.000.000" },
    ],
    rating: [
      { value: "all", label: "Semua Rating" },
      { value: "4.5", label: "4.5 +" },
      { value: "4", label: "4.0 +" },
      { value: "3.5", label: "3.5 +" },
      { value: "3", label: "3.0 +" },
    ],
  };

  const distanceSortOptions = {
    none: "Urutkan Jarak",
    nearest: "Jarak Terdekat",
    farthest: "Jarak Terjauh",
  };

  const filterIcons: Record<string, React.ElementType> = {
    kategori: Building2,
    harga: Wallet,
    rating: Star,
  };

  return (
    <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center gap-3 w-full max-w-full overflow-x-auto md:flex-wrap md:overflow-x-visible">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mr-2 flex-shrink-0">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filter:</span>
      </div>
      {Object.keys(filterOptions).map((key) => {
        const Icon = filterIcons[key];
        return (
          <DropdownMenu key={key}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-xs h-8 flex items-center gap-2">
                <Icon className="h-3 w-3" />
                <span>{filterOptions[key as keyof typeof filterOptions].find(opt => opt.value === filters[key as keyof Filters])?.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={filters[key as keyof Filters]} onValueChange={(value) => handleFilterChange(key as keyof Filters, value)}>
                {filterOptions[key as keyof typeof filterOptions].map(option => {
                  if (key === 'rating' && option.value !== 'all') {
                    return (
                      <DropdownMenuRadioItem key={option.value} value={option.value} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>{option.label}</span>
                      </DropdownMenuRadioItem>
                    );
                  }
                  return (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-xs h-8 flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            <span>Fasilitas {filters.fasilitas.length > 0 && `(${filters.fasilitas.length})`}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-72 overflow-y-auto">
          <DropdownMenuLabel>Pilih Fasilitas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {FASILITAS_LIST.map((fasilitas) => (
            <DropdownMenuCheckboxItem
              key={fasilitas}
              checked={filters.fasilitas.includes(fasilitas)}
              onCheckedChange={() => handleFasilitasChange(fasilitas)}
            >
              {fasilitas}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isLocationAvailable && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-xs h-8 border-primary/50 text-primary hover:text-primary">
              <ArrowDownUp className="h-3 w-3 mr-2" />
              {distanceSortOptions[distanceSort]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={distanceSort} onValueChange={(value) => onDistanceSortChange(value as DistanceSort)}>
              <DropdownMenuRadioItem value="none">Urutan Default</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="nearest">Jarak Terdekat</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="farthest">Jarak Terjauh</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="flex-grow"></div>
      <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-8 text-muted-foreground hover:text-destructive">
        <Trash2 className="h-3 w-3 mr-1.5" />
        Reset
      </Button>
    </div>
  );
};