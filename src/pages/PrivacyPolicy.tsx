import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/PetaSarePolos.png";
import AnimatedPage from "@/components/AnimatedPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatedPage>
      <div className="flex flex-col min-h-screen">
        <Header
          className={`fixed top-0 left-0 right-0 py-3 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-sm border-b border-border shadow-sm"
              : "bg-transparent border-b-transparent"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="border-border transition-transform active:scale-95 h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Kebijakan Privasi</h1>
            </div>
          </div>
        </Header>
        <main className="flex-grow">
          <div className="bg-gradient-to-b from-white to-slate-50 dark:from-background dark:to-background/90 flex flex-col items-center pt-32 pb-16 px-4">
            <div className="max-w-3xl w-full space-y-10">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-400">
                  <img src={Logo} alt="PetaSare Logo" className="h-12 w-12 object-contain" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                  Kebijakan Privasi
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Privasi Anda penting bagi kami. Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-8 text-left space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">1. Informasi yang Kami Kumpulkan</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti saat Anda menggunakan filter atau menyimpan hotel di bookmark. Informasi ini terbatas pada preferensi Anda di dalam aplikasi (misalnya, daftar ID hotel di bookmark) dan tidak mencakup data pribadi yang dapat diidentifikasi. Data ini disimpan secara lokal di perangkat Anda menggunakan Local Storage browser.
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Informasi yang kami kumpulkan digunakan semata-mata untuk meningkatkan pengalaman Anda dalam menggunakan PetaSare. Daftar Bookmark Anda disimpan agar Anda dapat dengan mudah mengaksesnya kembali di sesi berikutnya. Kami tidak membagikan, menjual, atau menyewakan data preferensi Anda kepada pihak ketiga mana pun.
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">3. Keamanan Data</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Karena data preferensi (seperti bookmark) disimpan di Local Storage browser Anda, keamanannya bergantung pada keamanan browser dan perangkat yang Anda gunakan. Kami tidak mentransfer data ini ke server kami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default PrivacyPolicy;