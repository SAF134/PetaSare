import { useState } from "react";
import { Review } from "@/data/hotels";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";

interface HotelReviewsProps {
  reviews: Review[];
  onAddReview: (newReview: Review) => void;
}

export const HotelReviews = ({ reviews, onAddReview }: HotelReviewsProps) => {
  const [newReview, setNewReview] = useState({ user: "", comment: "", rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.user && newReview.comment && newReview.rating > 0) {
      const reviewToAdd: Review = {
        ...newReview,
        date: new Date().toISOString().split("T")[0],
      };
      onAddReview(reviewToAdd);
      setNewReview({ user: "", comment: "", rating: 0 });
      toast.success("Ulasan Anda telah ditambahkan!", {
        description: "Ulasan ini hanya akan terlihat di sesi Anda saat ini.",
      });
    } else {
      toast.error("Harap isi semua kolom dan berikan rating.");
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <h4 className="font-semibold text-foreground mb-4 text-base">Ulasan Pengguna</h4>
      
      {/* Daftar Ulasan */}
      <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-2">
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${review.user}`} />
                <AvatarFallback>{review.user.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground text-sm">{review.user}</p>
                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                <p className="text-xs text-muted-foreground/70 mt-2">{new Date(review.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada ulasan untuk hotel ini.</p>
        )}
      </div>

      {/* Formulir Tambah Ulasan */}
      <div>
        <h5 className="font-semibold text-foreground mb-3 text-sm">Tulis Ulasan Anda</h5>
        <form onSubmit={handleAddReview} className="space-y-4">
          <Input
            placeholder="Nama Anda"
            value={newReview.user}
            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
            required
          />
          <Textarea
            placeholder="Bagaimana pengalaman menginap Anda?"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            required
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Rating Anda:</span>
            <div className="flex" onMouseLeave={() => setHoverRating(0)}>
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 cursor-pointer transition-colors ${
                    (hoverRating || newReview.rating) > i
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full transition-transform hover:scale-105 active:scale-95">
            <Send className="h-4 w-4 mr-2" />
            Kirim Ulasan
          </Button>
        </form>
      </div>
    </div>
  );
};