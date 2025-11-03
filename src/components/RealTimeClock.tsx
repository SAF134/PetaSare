import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atur interval untuk memperbarui waktu setiap detik
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Bersihkan interval saat komponen di-unmount untuk mencegah memory leak
    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Format tanggal dan waktu menggunakan date-fns dengan locale Indonesia
  const formattedTime = format(currentTime, 'EEEE, d MMMM yyyy, HH:mm:ss', { locale: id });

  return (
    <div className="text-sm text-muted-foreground text-right tabular-nums">
      {formattedTime}
    </div>
  );
};