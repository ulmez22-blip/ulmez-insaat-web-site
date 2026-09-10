'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'ulmez_quote_cart';

export function QuoteCartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === product.sku);
      if (existing) {
        return prev.map((i) =>
          i.sku === product.sku ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { sku: product.sku, name: product.name, unit: product.unit, quantity }];
    });
  }

  function updateQuantity(sku, quantity) {
    setItems((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  }

  function removeItem(sku) {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useQuoteCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useQuoteCart must be used within QuoteCartProvider');
  return ctx;
}
