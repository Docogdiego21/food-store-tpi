import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cerrarSesion, iniciarSesion, obtenerPerfil } from "../features/auth/api/auth";
import type { Usuario } from "../features/auth/types/usuario";
import { registrarManejadorSesion } from "../shared/api/axiosInstance";
import { queryClient } from "../shared/api/queryClient";

interface AuthState {
  usuario: Usuario | null;
  cargando: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  limpiarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,
      login: async (username, password) => {
        await iniciarSesion(username, password);
        const usuario = await obtenerPerfil();
        set({ usuario, cargando: false });
      },
      logout: async () => {
        try {
          await cerrarSesion();
        } finally {
          set({ usuario: null });
          queryClient.clear();
        }
      },
      checkSession: async () => {
        try {
          const usuario = await obtenerPerfil();
          set({ usuario, cargando: false });
        } catch {
          set({ usuario: null, cargando: false });
        }
      },
      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: "food-store-auth",
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);

registrarManejadorSesion(() => useAuthStore.getState().limpiarSesion());
