import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/PetaSarePolos.png";
import AnimatedPage from "@/components/AnimatedPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import AkmalPhoto from "@/assets/akmal.jpg";
import YusnarPhoto from "@/assets/yusnar.jpg";


const developers = [
  {
    name: "Syauqi Akmal Fadhali",
    role: "Mahasiswa Teknik Komputer 2022",
    imageUrl: AkmalPhoto,
  },
  {
    name: "Muhammad Yusnar Syamsuria",
    role: "Mahasiswa Teknik Komputer 2022",
    imageUrl: YusnarPhoto,
  },
];

const About = () => {
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
              <h1 className="text-lg font-semibold text-foreground">Tentang Kami</h1>
            </div>
          </div>
        </Header>
        <main className="flex-grow">
          <div className="bg-gradient-to-b from-white to-slate-50 dark:from-background dark:to-background/90 flex flex-col items-center pt-32 pb-16 px-4 gap-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-400">
                <img src={Logo} alt="PetaSare Logo" className="h-12 w-12 object-contain" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Tentang PetaSare
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Misi kami adalah mempermudah pencarian hotel terbaik di Kota Bandung.
              </p>
            </div>

            <div className="max-w-3xl w-full bg-card border border-border rounded-xl p-8 text-left space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Cerita Kami</h2>
              <p className="text-muted-foreground leading-relaxed">
                PetaSare lahir dari sebuah ide sederhana: bagaimana jika mencari hotel di Bandung bisa semudah melihat peta? Kami, sekelompok mahasiswa yang bersemangat tentang teknologi dan pariwisata, memutuskan untuk mewujudkan ide tersebut. Proyek ini merupakan bagian dari tugas mata kuliah Teknologi Pemetaan Berbasis Web, yang bertujuan untuk mengaplikasikan ilmu geospasial dalam solusi praktis.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Kami mengumpulkan data dari berbagai sumber untuk menyajikan informasi hotel yang akurat dan komprehensif. Dengan antarmuka yang visual dan interaktif, kami berharap PetaSare dapat menjadi teman perjalanan Anda yang paling andal saat merencanakan kunjungan ke Bandung.
              </p>
            </div>

            {/* Team Section */}
            <div className="max-w-4xl w-full text-center">
              <h2 className="text-3xl font-bold text-foreground mb-10">Tim di Balik PetaSare</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {developers.map((dev, index) => (
                  <motion.div
                    key={index}
                    className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center transition-all hover:shadow-lg hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <img src={dev.imageUrl} alt={dev.name} className="w-24 h-24 rounded-full mb-4 border-4 border-primary/20" />
                    <h3 className="text-xl font-semibold text-foreground">{dev.name}</h3>
                    <p className="text-primary font-medium mb-4">{dev.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default About;