import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hotels, Hotel } from "@/data/hotels";
import { FilterPanelHorizontal, Filters } from "@/components/FilterPanelHorizontal";
import { HotelCard } from "@/components/HotelCard";
import { HotelCardSkeleton } from "@/components/HotelCardSkeleton";
import { HotelDetailModal } from "@/components/HotelDetailModal";
import { MapView } from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowUp, Bookmark, Home, MapPin, Expand, Minimize, Search } from "lucide-react";
import { LatLngBounds } from "leaflet";
import { Header } from "@/components/Header";
import { ActiveFiltersDisplay } from "@/components/ActiveFiltersDisplay";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/PetaSarePolos.png";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchBar } from "@/components/SearchBar";
import { RealTimeClock } from "@/components/RealTimeClock";
import { toast } from "sonner";
import { calculateDistance } from "@/lib/distance";
import { useLocation } from "@/contexts/LocationContext";

const Hotels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    kategori: "all",
    fasilitas: [],
    harga: "all",
    rating: "all",
    distanceRange: "all",
  });
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [highlightedHotelId, setHighlightedHotelId] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [displayedHotels, setDisplayedHotels] = useState<Hotel[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const navigate = useNavigate();
  const { userLocation, requestUserLocation } = useLocation();
  const isMobile = useIsMobile();
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Animation variants for the title in the header
  const titleContainerVariants = {
    hover: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const letterVariants = {
    initial: { y: 0 },
    hover: {
      y: -4,
      color: "#fb923c", // orange-400
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
        duration: 0.3,
      },
    },
  };

  const logoHoverVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };
  const word = "PetaSare";

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("hotelBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Effect for shrinking header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save bookmarks to localStorage
  const toggleBookmark = (hotelId: number) => {
    const isBookmarked = bookmarks.includes(hotelId);
    const newBookmarks = isBookmarked
      ? bookmarks.filter((id) => id !== hotelId)
      : [...bookmarks, hotelId];

    setBookmarks(newBookmarks);
    localStorage.setItem("hotelBookmarks", JSON.stringify(newBookmarks));

    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      toast.success(isBookmarked ? `Dihapus dari bookmark` : `Ditambahkan ke bookmark`, { description: hotel.nama });
    }
  };

  // Memoized filtering logic
  const filteredHotels = useMemo(
    () =>
      hotels.filter((hotel) => {
        // Search filter
        if (searchQuery && !hotel.nama.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Category filter
        if (filters.kategori !== "all" && hotel.kategori !== filters.kategori) {
          return false;
        }
        // Facilities filter
        if (filters.fasilitas.length > 0 && !filters.fasilitas.every((f) => hotel.fasilitas.includes(f))) {
          return false;
        }
        // Price filter
        if (filters.harga !== "all" && filters.harga !== "over1000000") {
          const maxPrice = parseInt(filters.harga);
          if (hotel.harga > maxPrice) return false;
        }
        if (filters.harga === "over1000000") {
          if (hotel.harga <= 1000000) return false;
        }
        // Rating filter
        if (filters.rating !== "all" && filters.rating !== "under3") {
          const minRating = parseFloat(filters.rating);
          if (hotel.rating < minRating) return false;
        }
        if (filters.rating === "under3") {
          if (hotel.rating >= 3.0) return false;
        }
        // Bookmarks filter
        if (showBookmarksOnly && !bookmarks.includes(hotel.id)) {
          return false;
        }
        // Distance filter
        if (filters.distanceRange !== "all") {
          if (!userLocation) {
            return false; // If distance filter is active but no user location, hide hotel
          }
          const distance = calculateDistance(userLocation.lat, userLocation.lng, hotel.lat, hotel.lng);
          switch (filters.distanceRange) {
            case "lt2km":
              if (distance > 2) return false;
              break;
            case "lt4km":
              if (distance > 4) return false;
              break;
            case "lt6km":
              if (distance > 6) return false;
              break;
            case "lt8km":
              if (distance > 8) return false;
              break;
            case "lt10km":
              if (distance > 10) return false;
              break;
            case "gt10km":
              if (distance <= 10) return false;
              break;
            default:
              break;
          }
        }
        return true;
      }),
    [searchQuery, filters, showBookmarksOnly, bookmarks]
  );

  // Memoized hotels visible on map
  const hotelsOnMap = useMemo(() => {
    if (!mapBounds) {
      return filteredHotels; // Tampilkan semua hotel yang difilter jika batas peta belum diatur
    }
    return filteredHotels.filter(hotel => {
      return mapBounds.contains([hotel.latitude, hotel.longitude]);
    });
  }, [filteredHotels, mapBounds]);

  // Handler untuk memperbarui batas peta dari komponen MapView
  const handleBoundsChange = (bounds: LatLngBounds) => setMapBounds(bounds);

  // Effect to handle loading state and update displayed hotels
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let hotelsToDisplay = [...filteredHotels];

      // Jika lokasi pengguna tersedia, urutkan hotel berdasarkan jarak terdekat
      if (userLocation) {
        hotelsToDisplay.sort((a, b) => {
          const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
          const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
          return distanceA - distanceB;
        });
      }

      setDisplayedHotels(hotelsToDisplay);
      setIsLoading(false);
    }, 300); // Simulate loading for 300ms

    return () => clearTimeout(timer);
  }, [filteredHotels, userLocation]);

  // Effect to scroll to map when a hotel is selected via "Go to Map"
  useEffect(() => {
    // Only scroll if the map is visible and a hotel has been selected
    if (showMap && selectedHotel) {
      // The timeout should roughly match the transition duration of the map container
      const scrollTimer = setTimeout(() => {
        mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500); // Match the 500ms transition duration
      return () => clearTimeout(scrollTimer);
    }
  }, [selectedHotel, showMap]);

  const handleClearFilters = () => {
    setFilters({
      kategori: "all",
      fasilitas: [],
      harga: "all",
      rating: "all",
      distanceRange: "all",
    });
    setSearchQuery("");
    setShowBookmarksOnly(false);
  };

  const handleRemoveFilter = (type: keyof Filters | 'search' | 'bookmarks', value?: string) => {
    if (type === 'search') {
      setSearchQuery('');
    } else if (type === 'bookmarks') {
      setShowBookmarksOnly(false);
    } else if (type === 'fasilitas' && value) {
      setFilters((prev) => ({
        ...prev,
        fasilitas: prev.fasilitas.filter(f => f !== value)
      }));
    } else if (type !== 'fasilitas') {
      setFilters(prev => ({
        ...prev,
        [type]: 'all'
      }));
    }
  };

  const handleViewDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setDetailModalOpen(true);
  };

  const handleHotelClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setDetailModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header className="bg-surface-elevated/80 backdrop-blur-sm border-b border-border sticky top-0 shadow-md py-4 z-40">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 transition-all duration-300">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => navigate("/")} className="mr-2 transition-transform active:scale-95 h-9 w-9 border-border">
                  <Home className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Kembali ke Beranda</p></TooltipContent>
            </Tooltip>
            <motion.div
              className="rounded-lg bg-orange-400 flex items-center justify-center transition-all duration-300 w-10 h-10 cursor-pointer"
              variants={logoHoverVariants}
              initial="initial"
              whileHover="hover"
              onClick={() => navigate("/")}
            >
              <img src={Logo} alt="PetaSare Logo" className="h-8 w-8 object-contain" />
            </motion.div>
            <div>
              <motion.h1
                variants={titleContainerVariants}
                initial="initial"
                whileHover="hover"
                className="text-xl font-bold text-foreground flex cursor-pointer"
                aria-label={word}
              >
                {word.split("").map((letter, index) => (
                  <motion.span key={index} variants={letterVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
              <p className="text-xs text-muted-foreground -mt-1">Cari Hotel Menuju Kasur Terbaik</p>
            </div>
          </div>

          {/* Tombol Search untuk Mobile */}
          <div className="md:hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowSearchModal(true)} className="border-border transition-transform active:scale-95 h-9 w-9">
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Cari Hotel</p></TooltipContent>
            </Tooltip>
          </div>

          {/* Grup Tombol Utama */}
          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={showBookmarksOnly ? "default" : "outline"} size="sm" onClick={() => setShowBookmarksOnly(!showBookmarksOnly)} className={`${showBookmarksOnly ? "bg-primary" : "border-border"} transition-transform active:scale-95`}>
                  <Bookmark className={`h-4 w-4 mr-2 ${showBookmarksOnly ? "fill-current" : ""}`} />
                  Bookmark ({bookmarks.length})
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{showBookmarksOnly ? "Tampilkan semua hotel" : "Daftar Bookmark"}</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={showMap ? "default" : "outline"} size="sm" onClick={() => setShowMap(!showMap)} className={`${showMap ? "bg-primary" : "border-border"} transition-transform active:scale-95`}>
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? "Sembunyikan Peta" : "Tampilkan Peta"}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{showMap ? "Sembunyikan peta" : "Tampilkan peta"}</p></TooltipContent>
            </Tooltip>
            {/* Tombol Search untuk Desktop */}
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowSearchModal(true)} className="border-border transition-transform active:scale-95 h-9 w-9">
                    <Search className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Cari Hotel</p></TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center transition-all duration-300 ease-in-out h-auto opacity-100 mt-3">
          <div className="text-sm text-muted-foreground">
            {isLoading
              ? "Memuat hotel..."
              : `Menampilkan ${displayedHotels.length} dari ${hotels.length} hotel`}
          </div>
          {/* Menambahkan komponen jam waktu nyata di sini */}
          <RealTimeClock />
        </div>
        <div className="pt-4">
            <FilterPanelHorizontal
                filters={filters}
                onFiltersChange={setFilters}
                onClear={handleClearFilters}
                isLocationAvailable={!!userLocation}
            />
        </div>
      </Header>
      <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cari Nama Hotel</DialogTitle>
          </DialogHeader>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-2 pb-6">
        {/* Active Filters Display */}
                  <ActiveFiltersDisplay
                    filters={filters}
                    searchQuery={searchQuery}
                    showBookmarksOnly={showBookmarksOnly}
                    onRemoveFilter={handleRemoveFilter}
                    isLocationAvailable={!!userLocation}
                  />
        <div className="w-full">
          {/* Hotel List and Map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map View with Transition */}
            <div
              ref={mapContainerRef}
              className={`relative z-10 col-span-1 sm:col-span-2 lg:col-span-3 rounded-xl overflow-hidden transition-all duration-500 ease-in-out ${
                showMap
                  ? `${isMapExpanded ? "h-[80vh]" : "h-[400px]"} opacity-100 border border-border shadow-lg mb-6`
                  : "h-0 opacity-0 border-0 shadow-none mb-0"
              }`}
            >
              <MapView
                hotels={hotelsOnMap}
                selectedHotel={selectedHotel}
                highlightedHotelId={highlightedHotelId}
                onHotelClick={handleHotelClick}
                userLocation={userLocation}
                onLocateUserTrigger={requestUserLocation}
                onBoundsChange={handleBoundsChange}
                distanceRange={filters.distanceRange}
              />
              {showMap && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-4 right-4 z-20 h-10 w-10 rounded-full shadow-lg"
                      onClick={() => setIsMapExpanded(!isMapExpanded)}
                    >
                      {isMapExpanded ? <Minimize className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left"><p>{isMapExpanded ? "Perkecil Peta" : "Perluas Peta"}</p></TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Hotel Cards */}
            {isLoading ? (
              // Render skeleton loaders
              Array.from({ length: 9 }).map((_, index) => (
                <HotelCardSkeleton key={index} />
              )) // Tampilkan semua hasil filter di daftar kartu, bukan hanya yang ada di peta
            ) : displayedHotels.length > 0 ? ( 
              <AnimatePresence> 
                {displayedHotels.map((hotel, index) => (
                  <motion.div
                    key={hotel.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <HotelCard
                      distance={
                        userLocation
                          ? calculateDistance(
                              userLocation.lat,
                              userLocation.lng,
                              hotel.lat,
                              hotel.lng
                            )
                          : undefined}
                      isHighlighted={highlightedHotelId === hotel.id}
                      hotel={hotel}
                      onViewDetails={handleViewDetails}
                      onHighlight={setHighlightedHotelId}
                      isBookmarked={bookmarks.includes(hotel.id)}
                      onToggleBookmark={toggleBookmark}
                      onGoToMap={(h) => {
                        setShowMap(true); // Tampilkan peta
                        setSelectedHotel(h); // Pilih hotel
                        setHighlightedHotelId(h.id); // Sorot hotel di peta
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              showBookmarksOnly && bookmarks.length === 0 ? (
                <div className="text-center py-16 col-span-full flex flex-col items-center gap-4">
                  <Bookmark className="h-16 w-16 text-muted-foreground/30" strokeWidth={1.5} />
                  <h3 className="text-xl font-semibold text-foreground mt-2">Daftar Bookmark Anda Kosong</h3>
                  <p className="text-muted-foreground max-w-md">
                    Klik ikon bookmark pada hotel yang Anda suka untuk menyimpannya di sini agar mudah ditemukan kembali.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowBookmarksOnly(false)}
                    className="mt-4 border-border transition-transform active:scale-95"
                  >
                    Kembali ke Daftar Hotel
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 col-span-full">
                  <p className="text-muted-foreground text-lg">Tidak ada hotel yang sesuai dengan filter</p>
                  <Button variant="outline" onClick={handleClearFilters} className="mt-4 border-border transition-transform active:scale-95">
                    Reset Filter
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Hotel Detail Modal */}
      <HotelDetailModal
        hotel={selectedHotel}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
          >
            <Button onClick={scrollToTop} size="icon" className="rounded-full shadow-lg h-12 w-12">
              <ArrowUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hotels;
