"use client";
import React, { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  const addToFavorites = (product) => {
    setFavorites((prev) =>
      prev.find((item) => item._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((item) => item._id !== id));
  };

  const addToCart = (product) => {
    setCart((prev) =>
      prev.find((item) => item._id === product._id)
        ? prev.map((item) =>
            item._id === product._id
              ? { ...item, qty: (item.qty || 1) + 1 }
              : item
          )
        : [...prev, { ...product, qty: 1 }]
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        favorites,
        cart,
        addToFavorites,
        removeFromFavorites,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
