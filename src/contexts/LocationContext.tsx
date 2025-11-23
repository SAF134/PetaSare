import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  userLocation: { lat: number; lng: number } | null;
  requestUserLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Optionally, handle errors (e.g., show a notification to the user)
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Optionally, handle lack of support
    }
  };

  return (
    <LocationContext.Provider value={{ userLocation, requestUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
