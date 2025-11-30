import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Filters } from "./FilterPanelHorizontal";
import { AnimatePresence, motion } from "framer-motion";

interface ActiveFiltersDisplayProps {
  filters: Filters;
  searchQuery: string;
  showBookmarksOnly: boolean;
  onRemoveFilter: (type: keyof Filters | 'search' | 'bookmarks', value?: string) => void;
}

const KATEGORI_MAP: { [key: string]: string } = {
  "HOTEL BINTANG 1": "Bintang 1",
  "HOTEL BINTANG 2": "Bintang 2",
  "HOTEL BINTANG 3": "Bintang 3",
  "HOTEL BINTANG 4": "Bintang 4",
  "HOTEL BINTANG 5": "Bintang 5",
};

const HARGA_MAP: { [key: string]: string } = {
  "200000": "< Rp 200.000",
  "400000": "< Rp 400.000",
  "600000": "< Rp 600.000",
  "800000": "< Rp 800.000",
  "1000000": "< Rp 1.000.000",
  "1000001": "> Rp 1.000.000",
};

const RATING_MAP: { [key: string]: string } = {
  "4.5": "4.5+",
  "4": "4.0+",
  "3.5": "3.5+",
  "3": "3.0+",
};

const JARAK_MAP: { [key: string]: string } = {
  "2": "<= 2 km",
  "4": "<= 4 km",
  "6": "<= 6 km",
  "8": "<= 8 km",
  "10": "<= 10 km",
  "over10": "> 10 km",
};

const FilterTag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <Badge variant="secondary" className="flex items-center gap-1.5 py-1 px-3 text-sm">
      {label}
      <button onClick={onRemove} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
        <X className="h-3.5 w-3.5" />
      </button>
    </Badge>
  </motion.div>
);

export const ActiveFiltersDisplay = ({ filters, searchQuery, showBookmarksOnly, onRemoveFilter }: ActiveFiltersDisplayProps) => {
  const activeFilters = [];

  if (searchQuery) {
    activeFilters.push(
      <FilterTag key="search" label={`Cari: "${searchQuery}"`} onRemove={() => onRemoveFilter('search')} />
    );
  }

  if (showBookmarksOnly) {
    activeFilters.push(
      <FilterTag key="bookmarks" label="Daftar Bookmark" onRemove={() => onRemoveFilter('bookmarks')} />
    );
  }

  if (filters.kategori !== 'all') {
    activeFilters.push(
      <FilterTag key="kategori" label={`Kategori: ${KATEGORI_MAP[filters.kategori] || filters.kategori}`} onRemove={() => onRemoveFilter('kategori')} />
    );
  }

  if (filters.harga !== 'all') {
    activeFilters.push(
      <FilterTag key="harga" label={`Harga: ${HARGA_MAP[filters.harga] || filters.harga}`} onRemove={() => onRemoveFilter('harga')} />
    );
  }

  if (filters.rating !== 'all') {
    activeFilters.push(
      <FilterTag key="rating" label={`Rating: ${RATING_MAP[filters.rating] || filters.rating}`} onRemove={() => onRemoveFilter('rating')} />
    );
  }

  if (filters.jarak !== 'all') {
    activeFilters.push(
      <FilterTag key="jarak" label={`Jarak: ${JARAK_MAP[filters.jarak] || filters.jarak}`} onRemove={() => onRemoveFilter('jarak')} />
    );
  }

  filters.fasilitas.forEach(f => {
    activeFilters.push(
      <FilterTag key={`fasilitas-${f}`} label={f} onRemove={() => onRemoveFilter('fasilitas', f)} />
    );
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-medium text-muted-foreground">Filter Aktif:</span>
      <AnimatePresence>{activeFilters}</AnimatePresence>
    </div>
  );
};