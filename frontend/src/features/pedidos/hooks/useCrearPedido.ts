import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearPedido } from "../api/pedidos";
import type { PedidoCreate } from "../types/pedido";

export function useCrearPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: PedidoCreate) => crearPedido(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      void queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}
