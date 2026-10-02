"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MAX_QTY, priceCart, type CartLine } from "@/lib/pricing";

const KEY = "cqs-cart-v1";

interface CartApi {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (index: number, quantity: number) => void;
  remove: (index: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartApi | null>(null);

const same = (a: CartLine, b: Omit<CartLine, "quantity">) =>
  a.slug === b.slug && a.category === b.category && a.option === b.option && a.colour === b.colour;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => same(l, line));
      if (i === -1) return [...prev, { ...line, quantity: Math.min(quantity, MAX_QTY) }];
      const next = [...prev];
      next[i] = { ...next[i], quantity: Math.min(next[i].quantity + quantity, MAX_QTY) };
      return next;
    });
  }, []);

  const setQuantity = useCallback((index: number, quantity: number) => {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, quantity: Math.max(1, Math.min(quantity, MAX_QTY)) } : l))
    );
  }, []);

  const remove = useCallback((index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartApi>(() => {
    const priced = priceCart(lines);
    return {
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: priced.reduce((n, l) => n + l.lineTotal, 0),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
