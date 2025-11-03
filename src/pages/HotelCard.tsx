import { useState, useEffect, useRef } from 'react';
import { Hotel } from '@/data/hotels';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Bookmark } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  isHighlighted: boolean;
  isBookmarked: boolean;
  onViewDetails: (hotel: Hotel) => void;
  onHighlight: (id: number | null) => void;
  onToggleBookmark: (id: number) => void;
  onGoToMap: (hotel: Hotel) => void;
}

const getOptimizedUrl = (url: string) => {
  // Optimasi khusus untuk URL ImageKit
  if (url.includes("ik.imagekit.io")) {
    // Meminta versi gambar dengan lebar 400px, kualitas 80
    return `${url.split('?')[0]}?tr=w-400,q-80`;
  }
  // Untuk URL lain, kembalikan URL asli
  return url;
};

export const HotelCard = ({
  hotel,
  isHighlighted,
  isBookmarked,
  onViewDetails,
  onHighlight,
  onToggleBookmark,
  onGoToMap,
}: HotelCardProps) => {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '100px' } // Mulai memuat gambar 100px sebelum masuk viewport
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const optimizedImageUrl = getOptimizedUrl(hotel.gambar);

  return (
    <Card
      ref={cardRef}
      className={`overflow-hidden transition-all duration-300 ${isHighlighted ? 'ring-2 ring-primary shadow-lg' : 'shadow-md'}`}
      onMouseEnter={() => onHighlight(hotel.id)}
      onMouseLeave={() => onHighlight(null)}
    >
      <CardHeader className="p-0 relative">
        <div className="aspect-video w-full bg-muted animate-pulse">
          {isImageVisible && (
            <img
              src={optimizedImageUrl}
              alt={hotel.nama}
              className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              loading="lazy" // Atribut native lazy loading sebagai fallback
            />
          )}
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <Badge variant="destructive" className="flex items-center gap-1">
            <Star className="h-3 w-3" /> {hotel.rating}
          </Badge>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => onToggleBookmark(hotel.id)}>
            <Bookmark className={`h-4 w-4 transition-colors ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold truncate">{hotel.nama}</CardTitle>
        <p className="text-sm text-muted-foreground truncate mt-1">{hotel.alamat}</p>
        <div className="mt-3">
          <p className="text-lg font-semibold text-primary">
            Rp {hotel.harga.toLocaleString('id-ID')}
            <span className="text-sm font-normal text-muted-foreground"> / malam</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={() => onViewDetails(hotel)} className="w-full">Lihat Detail</Button>
        <Button onClick={() => onGoToMap(hotel)} variant="outline" className="w-full">
          <MapPin className="h-4 w-4 mr-2" />
          Peta
        </Button>
      </CardFooter>
    </Card>
  );
};