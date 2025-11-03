import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Phone, MapPin, Send, Github, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/PetaSarePolos.png";
import AnimatedPage from "@/components/AnimatedPage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoHoverVariants: Variants = {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      details: [
        { value: "syauqiakmal137@gmail.com", href: "mailto:syauqiakmal137@gmail.com" },
        { value: "yusnar2004@gmail.com", href: "mailto:yusnar2004@gmail.com" },
      ],
    },
    {
      icon: Phone,
      label: "Telepon",
      details: [
        { value: "0812 9862 8236 (Syauqi)", href: "tel:+6281298628236" },
        { value: "0812 1168 1390 (Yusnar)", href: "tel:+6281211681390" },
      ],
    },
    {
      icon: MapPin,
      label: "Alamat",
      details: [
        { value: "Jl. Telekomunikasi Terusan Buahbatu No.1, Sukapura, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40257", href: "https://maps.app.goo.gl/ZcLbR9XJqWRhP73U8" },
      ],
    },
    {
      icon: Github,
      label: "Github",
      details: [
        { value: "SAF134", href: "https://github.com/SAF134" },
        { value: "NCIKYASA99", href: "https://github.com/NCIKYASA99" },
      ],
    },
    {
      icon: Instagram,
      label: "Instagram",
      details: [
        { value: "@saf.134", href: "https://www.instagram.com/saf.134/" },
        { value: "@mysnr1", href: "https://www.instagram.com/mysnr1/" },
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Pesan Anda telah terkirim!", {
      description: "Terima kasih telah menghubungi kami. Kami akan segera merespons Anda.",
      duration: 5000,
    });
    setFormData({ name: "", email: "", message: "" });
  };

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
              <h1 className="text-lg font-semibold text-foreground">Kontak</h1>
            </div>
          </div>
        </Header>
        <main className="flex-grow">
          <div className="bg-gradient-to-b from-background via-surface to-background flex flex-col items-center pt-32 pb-16 px-4 gap-12">
            <div className="text-center space-y-4">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-400 cursor-pointer"
                variants={logoHoverVariants}
                initial="initial"
                whileHover="hover"
              >
                <img src={Logo} alt="PetaSare Logo" className="h-12 w-12 object-contain" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Kontak
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Kami siap membantu Anda.
              </p>
            </div>

            <div className="max-w-2xl w-full bg-card border border-border rounded-xl p-8 text-left space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <item.icon className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">{item.label}</h3>
                    <div className="flex flex-col">
                      {item.details.map((detail, detailIndex) => (
                        <a key={detailIndex} href={detail.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          {detail.value}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-2xl w-full bg-card border border-border rounded-xl p-8 text-left">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Kritik dan Saran</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input id="name" type="text" placeholder="Nama Anda" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email Anda" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    placeholder="Tuliskan pesan Anda di sini..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full transition-transform hover:scale-105 active:scale-95">
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Pesan
                </Button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Contact;