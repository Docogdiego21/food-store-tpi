import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { DataTable } from "../../../shared/components/DataTable";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Skeleton } from "../../../shared/components/Skeleton";
import { Button } from "../../../shared/ui/Button";
import { useAuthStore } from "../../../store/authStore";
import type { Usuario } from "../../auth/types/usuario";
import { useCambiarEstadoUsuario, useUsuarios } from "../hooks/useUsuarios";

export function AdminUsuariosPage() {
  const usuarios = useUsuarios();
  const cambiarEstado = useCambiarEstadoUsuario();
  const sesion = useAuthStore((s) => s.usuario);
  const [error, setError] = useState<string | null>(null);

  const cambiar = (usuario: Usuario, activar: boolean) => {
    setError(null);
    cambiarEstado.mutate({ id: usuario.id, activar }, { onError: (e) => setError(handleApiError(e)) });
  };

  const columnas: ColumnDef<Usuario>[] = [
    { header: "Usuario", cell: ({ row }) => <span className="font-medium">{row.original.username}</span> },
    { header: "Nombre", accessorKey: "full_name" },
    { header: "Email", accessorKey: "email" },
    { header: "Rol", accessorKey: "role" },
    {
      header: "Estado",
      cell: ({ row }) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            row.original.disabled ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {row.original.disabled ? "Desactivado" : "Activo"}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const usuario = row.original;
        if (usuario.disabled) {
          return (
            <Button disabled={cambiarEstado.isPending} onClick={() => cambiar(usuario, true)}>
              Activar
            </Button>
          );
        }
        if (usuario.id === sesion?.id) return null;
        return (
          <Button variante="peligro" disabled={cambiarEstado.isPending} onClick={() => cambiar(usuario, false)}>
            Desactivar
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Usuarios</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {usuarios.isLoading ? (
        <Skeleton className="h-48" />
      ) : usuarios.isError ? (
        <EstadoError mensaje={handleApiError(usuarios.error)} onReintentar={() => void usuarios.refetch()} />
      ) : usuarios.data && usuarios.data.length === 0 ? (
        <EstadoVacio titulo="No hay usuarios" />
      ) : (
        usuarios.data && <DataTable data={usuarios.data} columns={columnas} />
      )}
    </div>
  );
}
