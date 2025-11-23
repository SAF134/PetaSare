import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LocationProvider } from "./contexts/LocationContext.tsx";

const Main = () => {
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      // Tambahkan kelas untuk memulai animasi fade-out
      preloader.classList.add('hidden');
      // Hapus elemen dari DOM setelah animasi selesai
      // Durasi timeout harus sama dengan durasi transisi di CSS (0.5s = 500ms)
      setTimeout(() => preloader.remove(), 500);
    }
  }, []);

  return (
    <LocationProvider>
      <App />
    </LocationProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
