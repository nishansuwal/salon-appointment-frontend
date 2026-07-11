import { createContext, useContext, useEffect, useState } from "react";

const BookingCartContext = createContext(null);

export function BookingCartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("booking-cart");
    return stored ? JSON.parse(stored) : { services: [] };
  });

  useEffect(() => {
    localStorage.setItem("booking-cart", JSON.stringify(cart));
  }, [cart]);

  const addService = (serviceId, staffId = null) => {
    setCart((prev) => {
      if (prev.services.some((s) => s.serviceId === serviceId)) {
        return prev; // prevent duplicates
      }

      return {
        ...prev,
        services: [...prev.services, { serviceId, staffId }],
      };
    });
  };

  const removeService = (serviceId) => {
    setCart((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.serviceId !== serviceId),
    }));
  };

  const updateStaff = (serviceId, staffId) => {
    setCart((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.serviceId === serviceId ? { ...s, staffId } : s
      ),
    }));
  };

  const clearCart = () => {
    setCart({ services: [] });
  };

  return (
    <BookingCartContext.Provider
      value={{
        cart,
        addService,
        removeService,
        updateStaff,
        clearCart,
      }}
    >
      {children}
    </BookingCartContext.Provider>
  );
}

export const useBookingCart = () => {
  const ctx = useContext(BookingCartContext);
  if (!ctx) {
    throw new Error("useBookingCart must be used inside BookingCartProvider");
  }
  return ctx;
};