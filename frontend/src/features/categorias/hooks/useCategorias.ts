import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from "../api/categorias";
import type { CategoriaInput } from "../types/categoria";

export function useCategorias() {
  return useQuery({ queryKey: ["categorias"], queryFn: listarCategorias });
}

function useInvalidarCategorias() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["categorias"] });
    void queryClient.invalidateQueries({ queryKey: ["productos"] });
  };
}

export function useCrearCategoria() {
  const invalidar = useInvalidarCategorias();
  return useMutation({
    mutationFn: (datos: CategoriaInput) => crearCategoria(datos),
    onSuccess: invalidar,
  });
}

export function useActualizarCategoria() {
  const invalidar = useInvalidarCategorias();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: CategoriaInput }) => actualizarCategoria(id, datos),
    onSuccess: invalidar,
  });
}

export function useEliminarCategoria() {
  const invalidar = useInvalidarCategorias();
  return useMutation({
    mutationFn: (id: number) => eliminarCategoria(id),
    onSuccess: invalidar,
  });
}
