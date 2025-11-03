import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import Logo from "@/assets/PetaSarePolos.png";

const NotFound = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-orange-400 mb-8">
          <img src={Logo} alt="PetaSare Logo" className="h-16 w-16 object-contain" />
        </div>
        <h1 className="text-8xl md:text-9xl font-bold text-primary tracking-tighter">
          404
        </h1>
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-foreground">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Mari kami bantu Anda kembali ke jalan yang benar.
        </p>
        <Button asChild size="lg" className="mt-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
          <Link to="/">
            <Home className="h-5 w-5 mr-2" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </AnimatedPage>
  );
};

export default NotFound;
