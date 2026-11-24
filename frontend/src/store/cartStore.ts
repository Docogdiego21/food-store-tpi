import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  imagen_url: string | null;
  stock: number;
}

interface CartState {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, "cantidad">) => void;
  quitar: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      agregar: (item) =>
        set((state) => {
          const existente = state.items.find((i) => i.producto_id === item.producto_id);
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.producto_id === item.producto_id
                  ? { ...i, stock: item.stock, cantidad: Math.min(i.cantidad + 1, Math.max(item.stock, 1)) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad: 1 }] };
        }),
      quitar: (productoId) => set((state) => ({ items: state.items.filter((i) => i.producto_id !== productoId) })),
      cambiarCantidad: (productoId, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.producto_id === productoId ? { ...i, cantidad: Math.max(1, Math.min(cantidad, Math.max(i.stock, 1))) } : i,
          ),
        })),
      vaciar: () => set({ items: [] }),
      total: () => get().items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0),
    }),
    {
      name: "food-store-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
