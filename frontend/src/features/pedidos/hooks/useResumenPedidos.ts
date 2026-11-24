import { useQuery } from "@tanstack/react-query";
import { obtenerResumen } from "../api/pedidos";

export function useResumenPedidos() {
  return useQuery({ queryKey: ["resumen-pedidos"], queryFn: obtenerResumen });
}
