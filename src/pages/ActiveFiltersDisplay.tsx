import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Filters } from './FilterPanelHorizontal';
import { motion, AnimatePresence } from 'framer-motion';

interface ActiveFiltersDisplayProps {
  filters: Filters;
  searchQuery: string;
  showBookmarksOnly: boolean;
  onRemoveFilter: (type: keyof Filters | 'search' | 'bookmarks', value?: string) => void;
}

export const ActiveFiltersDisplay = ({ filters, searchQuery, showBookmarksOnly, onRemoveFilter }: ActiveFiltersDisplayProps) => {
  const activeFilters: { type: keyof Filters | 'search' | 'bookmarks'; value: string; label: string }[] = [];

  if (searchQuery) {
    activeFilters.push({ type: 'search', value: searchQuery, label: `Cari: "${searchQuery}"` });
  }

  if (showBookmarksOnly) {
    activeFilters.push({ type: 'bookmarks', value: 'true', label: 'Daftar Bookmark' });
  }

  if (filters.kategori !== 'all') {
    activeFilters.push({ type: 'kategori', value: filters.kategori, label: `Kategori: ${filters.kategori.charAt(0).toUpperCase() + filters.kategori.slice(1)}` });
  }

  if (filters.harga !== 'all') {
    activeFilters.push({ type: 'harga', value: filters.harga, label: `Harga: < Rp ${parseInt(filters.harga).toLocaleString('id-ID')}` });
  }

  if (filters.rating !== 'all') {
    activeFilters.push({ type: 'rating', value: filters.rating, label: `Rating: > ${filters.rating} ★` });
  }

  filters.fasilitas.forEach(f => {
    activeFilters.push({ type: 'fasilitas', value: f, label: f });
  });

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-muted-foreground mr-2">Filter Aktif:</span>
      <AnimatePresence>
        {activeFilters.map((filter) => (
          <motion.div key={filter.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
            <Badge variant="secondary" className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 text-sm font-normal border border-border">
              <span>{filter.label}</span>
              <button
                onClick={() => onRemoveFilter(filter.type, filter.type === 'fasilitas' ? filter.value : undefined)}
                className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                aria-label={`Hapus filter ${filter.label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};