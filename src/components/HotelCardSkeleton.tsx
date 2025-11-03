export const HotelCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4 overflow-hidden relative shimmer-effect">
      {/* Image Placeholder */}
      <div className="bg-muted rounded-md h-40 w-full"></div>

      {/* Content Placeholder */}
      <div className="space-y-3">
        {/* Title */}
        <div className="bg-muted rounded h-6 w-3/4"></div>
        {/* Category */}
        <div className="bg-muted rounded h-4 w-1/2"></div>
        {/* Rating and Price */}
        <div className="flex justify-between items-center pt-2">
          <div className="bg-muted rounded h-5 w-1/4"></div>
          <div className="bg-muted rounded h-8 w-1/3"></div>
        </div>
      </div>
    </div>
  );
};