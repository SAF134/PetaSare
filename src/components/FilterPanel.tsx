import { FASILITAS_LIST } from "@/data/hotels";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Filters {
  kategori: string[];
  fasilitas: string[];
  harga: string;
  rating: string;
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
}

export const FilterPanel = ({ filters, onFiltersChange, onClear }: FilterPanelProps) => {
  const kategoriOptions = ["HOTEL BINTANG 1", "HOTEL BINTANG 2", "HOTEL BINTANG 3", "HOTEL BINTANG 4", "HOTEL BINTANG 5"];
  const hargaOptions = [
    { label: "Semua harga", value: "all" },
    { label: "Harga kurang dari sama dengan 200000", value: "200000" },
    { label: "Harga kurang dari sama dengan 400000", value: "400000" },
    { label: "Harga kurang dari sama dengan 600000", value: "600000" },
    { label: "Harga kurang dari sama dengan 800000", value: "800000" },
    { label: "Harga kurang dari sama dengan 1000000", value: "1000000" },
    { label: "Harga lebih dari sama dengan 1000000", value: "1000001" },
  ];

  const ratingOptions = [
    { label: "Semua penilaian", value: "all" },
    { label: "≥ 3.0", value: "3.0" },
    { label: "≥ 3.5", value: "3.5" },
    { label: "≥ 4.0", value: "4.0" },
    { label: "≥ 4.5", value: "4.5" },
];

  const handleKategoriChange = (kategori: string) => {
    const newKategori = filters.kategori.includes(kategori)
      ? filters.kategori.filter((k) => k !== kategori)
      : [...filters.kategori, kategori];
    onFiltersChange({ ...filters, kategori: newKategori });
  };

  const handleFasilitasChange = (fasilitas: string) => {
    const newFasilitas = filters.fasilitas.includes(fasilitas)
      ? filters.fasilitas.filter((f) => f !== fasilitas)
      : [...filters.fasilitas, fasilitas];
    onFiltersChange({ ...filters, fasilitas: newFasilitas });
  };

  const hasActiveFilters =
    filters.kategori.length > 0 ||
    filters.fasilitas.length > 0 ||
    filters.harga !== "all" ||
    filters.rating !== "all";

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filter</h2>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-220px)] pr-4">
        <div className="space-y-6">
          {/* Kategori */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Kategori Hotel</Label>
            <div className="space-y-2">
              {kategoriOptions.map((kategori) => (
                <div key={kategori} className="flex items-center space-x-2">
                  <Checkbox
                    id={kategori}
                    checked={filters.kategori.includes(kategori)}
                    onCheckedChange={() => handleKategoriChange(kategori)}
                    className="border-border"
                  />
                  <label
                    htmlFor={kategori}
                    className="text-sm text-foreground cursor-pointer select-none"
                  >
                    {kategori}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Harga */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Rentang Harga</Label>
            <RadioGroup value={filters.harga} onValueChange={(value) => onFiltersChange({ ...filters, harga: value })}>
              {hargaOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`harga-${option.value}`} className="border-border" />
                  <label
                    htmlFor={`harga-${option.value}`}
                    className="text-sm text-foreground cursor-pointer select-none"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Rating */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Rating</Label>
            <RadioGroup value={filters.rating} onValueChange={(value) => onFiltersChange({ ...filters, rating: value })}>
              {ratingOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`rating-${option.value}`} className="border-border" />
                  <label
                    htmlFor={`rating-${option.value}`}
                    className="text-sm text-foreground cursor-pointer select-none"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Fasilitas */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Fasilitas</Label>
            <div className="space-y-2">
              {FASILITAS_LIST.map((fasilitas) => (
                <div key={fasilitas} className="flex items-center space-x-2">
                  <Checkbox
                    id={fasilitas}
                    checked={filters.fasilitas.includes(fasilitas)}
                    onCheckedChange={() => handleFasilitasChange(fasilitas)}
                    className="border-border"
                  />
                  <label
                    htmlFor={fasilitas}
                    className="text-sm text-foreground cursor-pointer select-none"
                  >
                    {fasilitas}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
