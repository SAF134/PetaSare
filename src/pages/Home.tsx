import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Hotel, MapPin, Star, Filter, CheckSquare, Map, Sun, Moon, Menu, PlayCircle, X, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/assets/PetaSarePolos.png";
import AnimatedPage from "@/components/AnimatedPage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTheme } from "next-themes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HotelChart } from "@/components/HotelChart";
import { PriceChart } from "@/components/PriceChart";
import { RatingChart } from "@/components/RatingChart";

const Home = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const features = [
    {
      icon: Hotel,
      title: "145 Hotel di Kota Bandung",
      description: "Informasi hotel yang lengkap",
      details: "Data kami mencakup hotel bintang 1 hingga 5, apartemen, dan guesthouse di seluruh area Bandung.",
    },
    {
      icon: MapPin,
      title: "Peta Interaktif",
      description: "Melihat lokasi hotel dengan mudah",
      details: "Peta didukung oleh Leaflet, menampilkan cluster untuk kemudahan navigasi saat di-zoom out.",
    },
    {
      icon: ExternalLink,
      title: "Link Pemesanan",
      description: "Terdapat link pemesanan ke platform populer",
      details: "Link pemesanan disediakan untuk memudahkan Anda melakukan reservasi hotel.",
    },
  ];

  const howItWorksSteps = [
    {
      icon: Filter,
      title: "Cari & Filter",
      description: "Gunakan pencarian dan filter canggih untuk menemukan hotel yang sesuai dengan kebutuhan Anda.",
      details: "Tips: Gunakan filter harga dan fasilitas untuk mempersempit pilihan Anda dengan cepat.",
    },
    {
      icon: CheckSquare,
      title: "Pilih & Bandingkan",
      description: "Lihat detail, fasilitas, dan rating untuk membandingkan hotel pilihan Anda.",
      details: "Tips: Klik 'Lihat Detail' untuk melihat galeri foto dan ulasan lengkap.",
    },
    {
      icon: Map,
      title: "Lihat di Peta",
      description: "Visualisasikan lokasi hotel di peta interaktif untuk melihat lokasinya secara akurat.",
      details: "Tips: Klik hotel di daftar untuk menyorotnya di peta, atau sebaliknya.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Jeda antar animasi kartu
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

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

  // Animation variants for the logo in the hero section
  const logoHoverVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 5, // Sedikit rotasi untuk efek yang lebih menarik
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };
  const word = "PetaSare";

  return (
    <AnimatedPage>
      <Header
        className={`fixed top-0 left-0 right-0 py-3 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-sm border-b border-border shadow-sm"
            : "bg-transparent border-b-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-400 flex items-center justify-center transition-all duration-300 w-10 h-10">
              <img src={Logo} alt="PetaSare Logo" className="h-8 w-8 object-contain" />
            </div>
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
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link to="/about" className="hover:text-primary transition-colors">Tentang Kami</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Kontak</Link>
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            </nav>
            <div className="hidden md:block h-6 w-px bg-border"></div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="border-border transition-transform active:scale-95 h-9 w-9">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{theme === "dark" ? "Ubah ke mode terang" : "Ubah ke mode gelap"}</p></TooltipContent>
            </Tooltip>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-border h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link to="/about">Tentang Kami</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/contact">Kontak</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/privacy-policy">Kebijakan Privasi</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Header>

      <main className="flex-grow">
        <div className="bg-gradient-to-b from-white to-slate-50 dark:from-background dark:to-background/90 flex flex-col items-center justify-center px-4 pt-32 pb-12">
          <div className="max-w-5xl w-full text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-400">
              <motion.div
                variants={logoHoverVariants}
                initial="initial"
                whileHover="hover"
                className="cursor-pointer" // Menambahkan kursor pointer untuk indikasi interaktivitas
              >
                <img src={Logo} alt="PetaSare Logo" className="h-12 w-12 object-contain" />
              </motion.div>
            </div>
            <motion.h1
              variants={titleContainerVariants}
              initial="initial"
              whileHover="hover"
              className="text-5xl md:text-7xl font-bold text-foreground tracking-tight flex justify-center cursor-pointer"
              aria-label={word}
            >
              {word.split("").map((letter, index) => (
                <motion.span key={index} variants={letterVariants} className="inline-block">
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              "Temukan titik nyamanmu di Kota Bandung! Jelajahi hotel pilihan dengan peta interaktif, dan dapatkan detail akurat tentang lokasi, harga terbaik, dan fasilitas lengkap dalam satu dashboard visual."
            </p>
                                                            <motion.div
                                                              className="inline-block"
                                                              animate={{
                                                                scale: [1, 1.03, 1],
                                                              }}
                                                              transition={{
                                                                duration: 2.5,
                                                                repeat: Infinity,
                                                                repeatType: "loop",
                                                                ease: "easeInOut",
                                                              }}
                                                            >
                                                              <Button
                                                                onClick={() => navigate("/hotels")}
                                                                size="lg"
                                                                className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                                                              >
                                                                <MapPin className="h-5 w-5 mr-2" />
                                                                Mulai Menjelajahi
                                                              </Button>
                                                            </motion.div>          </div>

          {/* How It Works Section */}
          <motion.div
            className="pt-16 w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              Sederhana dan Intuitif
            </h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all hover:scale-105 hover:border-primary/50 flex flex-col items-center text-center"
                  variants={itemVariants}
                >
                  <motion.div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4" variants={iconVariants}>
                    <step.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="pt-12 w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Fitur Utama
            </h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all hover:scale-105 hover:border-primary/50 flex flex-col items-center text-center"
                  variants={itemVariants}
                >
                  <motion.div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4" variants={iconVariants}>
                    <feature.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
            {/* Chart Section */}
            <motion.div
                className="pt-12 w-full"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Visualisasi Data Hotel
                </h2>
                <motion.div className="flex flex-col gap-8" variants={itemVariants}>
                    <HotelChart />
                    <PriceChart />
                    <RatingChart />
                </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

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
    </AnimatedPage>
  );
};

export default Home;
