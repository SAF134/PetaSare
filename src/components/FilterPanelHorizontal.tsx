import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, Trash2, ArrowDownUp, Star, Building2, Wallet, Sparkles, MapPin } from "lucide-react";
import { FASILITAS_LIST } from "@/data/hotels";

export type DistanceRange = 'all' | 'lt2km' | 'lt4km' | 'lt6km' | 'lt8km' | 'lt10km' | 'gt10km';

export interface Filters {
  kategori: string;
  fasilitas: string[];
  harga: string;
  rating: string;
  distanceRange?: DistanceRange;
}

interface FilterPanelHorizontalProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
  isLocationAvailable: boolean;
}

export const FilterPanelHorizontal = ({
  filters,
  onFiltersChange,
  onClear,
  isLocationAvailable,
}: FilterPanelHorizontalProps) => {
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

  const distanceFilterOptions = [
    { value: "all", label: "Jarak Terdekat" },
    { value: "lt2km", label: "<= 2 km" },
    { value: "lt4km", label: "<= 4 km" },
    { value: "lt6km", label: "<= 6 km" },
    { value: "lt8km", label: "<= 8 km" },
    { value: "lt10km", label: "<= 10 km" },
    { value: "gt10km", label: "> 10 km" },
  ];

  const filterIcons: Record<string, React.ElementType> = {
    kategori: Building2,
    harga: Wallet,
    rating: Star,
  };

  return (
    <div className="bg-card p-3 rounded-xl border border-border shadow-sm flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mr-2">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filter:</span>
      </div>
      <div className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-2 -mb-2">
        {Object.keys(filterOptions).map((key) => {
          const Icon = filterIcons[key];
          return (
            <DropdownMenu key={key}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-xs h-8 flex items-center gap-2 flex-shrink-0">
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
            <Button variant="outline" className="text-xs h-8 flex items-center gap-2 flex-shrink-0">
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
              <Button variant="outline" className="text-xs h-8 flex items-center gap-2 flex-shrink-0">
                <MapPin className="h-3 w-3" />
                <span>{distanceFilterOptions.find(opt => opt.value === filters.distanceRange)?.label || "Jarak"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={filters.distanceRange || "all"}
                onValueChange={(value) => handleFilterChange("distanceRange", value as DistanceRange)}
              >
                {distanceFilterOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex-grow"></div>
      <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-8 text-muted-foreground hover:text-destructive flex-shrink-0">
        <Trash2 className="h-3 w-3 mr-1.5" />
        Reset
      </Button>
    </div>
  );
};