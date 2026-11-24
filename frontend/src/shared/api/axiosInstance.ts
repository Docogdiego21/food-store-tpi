import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let alExpirarSesion: (() => void) | null = null;

export function registrarManejadorSesion(manejador: () => void): void {
  alExpirarSesion = manejador;
}

const RUTAS_SIN_INTERCEPTOR = ["/auth/token", "/auth/me"];

axiosInstance.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data, config } = error.response;
      const url = config?.url ?? "";
      const detail = (data as { detail?: unknown } | undefined)?.detail;
      const sesionInvalida = status === 401 && !RUTAS_SIN_INTERCEPTOR.includes(url);
      const cuentaDesactivada = status === 400 && detail === "Cuenta de usuario desactivada";
      if ((sesionInvalida || cuentaDesactivada) && alExpirarSesion) {
        alExpirarSesion();
      }
    }
    return Promise.reject(error);
  },
);
