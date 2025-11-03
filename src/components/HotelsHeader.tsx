import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bookmark, MapPin, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/PetaSarePolos.png";
import { SearchBar } from "@/components/SearchBar";

interface HotelsHeaderProps {
  isScrolled: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  showBookmarksOnly: boolean;
  onToggleShowBookmarks: () => void;
  bookmarksCount: number;
  showMap: boolean;
  onToggleShowMap: () => void;
  isLoading: boolean;
  displayedHotelsCount: number;
  totalHotelsCount: number;
}

export const HotelsHeader = ({
  isScrolled,
  searchQuery,
  onSearchQueryChange,
  showBookmarksOnly,
  onToggleShowBookmarks,
  bookmarksCount,
  showMap,
  onToggleShowMap,
  isLoading,
  displayedHotelsCount,
  totalHotelsCount,
}: HotelsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-surface-elevated/80 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-md transition-all duration-300 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 transition-all duration-300">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="mr-2 transition-transform active:scale-95 h-9 w-9"
                >
                  <Home className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Kembali ke Beranda</p></TooltipContent>
            </Tooltip>
            <div className="rounded-lg bg-orange-400 flex items-center justify-center transition-all duration-300 w-10 h-10">
              <img src={Logo} alt="PetaSare Logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PetaSare</h1>
              <p className="text-xs text-muted-foreground">
                Cari Hotel Menuju Kasur Terbaik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showBookmarksOnly ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleShowBookmarks}
                  className={`${showBookmarksOnly ? "bg-primary" : "border-border"} mr-2 transition-transform active:scale-95`}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${showBookmarksOnly ? "fill-current" : ""}`} />
                  Bookmark ({bookmarksCount})
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{showBookmarksOnly ? "Tampilkan semua hotel" : "Daftar Bookmark"}</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showMap ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleShowMap}
                  className={`${showMap ? "bg-primary" : "border-border"} mr-2 transition-transform active:scale-95`}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{showMap ? "Sembunyikan peta" : "Tampilkan peta"}</p></TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out h-auto opacity-100 mt-4">
          <SearchBar value={searchQuery} onChange={onSearchQueryChange} />
        </div>

        <div className="transition-all duration-300 ease-in-out h-auto opacity-100 mt-3">
          <div className="text-sm text-muted-foreground">
            {isLoading
              ? "Memuat hotel..."
              : `Menampilkan ${displayedHotelsCount} dari ${totalHotelsCount} hotel`}
          </div>
        </div>
      </div>
    </header>
  );
};