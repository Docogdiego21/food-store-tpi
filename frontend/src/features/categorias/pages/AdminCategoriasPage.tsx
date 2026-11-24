import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { DataTable } from "../../../shared/components/DataTable";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Skeleton } from "../../../shared/components/Skeleton";
import { Button } from "../../../shared/ui/Button";
import { Modal } from "../../../shared/ui/Modal";
import { CategoriaForm } from "../components/CategoriaForm";
import { useCategorias, useEliminarCategoria } from "../hooks/useCategorias";
import type { Categoria } from "../types/categoria";

export function AdminCategoriasPage() {
  const categorias = useCategorias();
  const eliminar = useEliminarCategoria();
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abrirForm = (categoria: Categoria | null) => {
    setEditando(categoria);
    setFormAbierto(true);
  };

  const pedirBaja = (categoria: Categoria) => {
    if (!window.confirm(`¿Dar de baja la categoría "${categoria.nombre}"?`)) return;
    setError(null);
    eliminar.mutate(categoria.id, { onError: (e) => setError(handleApiError(e)) });
  };

  const columnas: ColumnDef<Categoria>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Nombre", cell: ({ row }) => <span className="font-medium">{row.original.nombre}</span> },
    { header: "Descripción", cell: ({ row }) => row.original.descripcion ?? "—" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variante="secundario" onClick={() => abrirForm(row.original)}>
            Editar
          </Button>
          <Button variante="peligro" disabled={eliminar.isPending} onClick={() => pedirBaja(row.original)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={() => abrirForm(null)}>Nueva categoría</Button>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {categorias.isLoading ? (
        <Skeleton className="h-48" />
      ) : categorias.isError ? (
        <EstadoError mensaje={handleApiError(categorias.error)} onReintentar={() => void categorias.refetch()} />
      ) : categorias.data && categorias.data.length === 0 ? (
        <EstadoVacio titulo="Todavía no hay categorías" />
      ) : (
        categorias.data && <DataTable data={categorias.data} columns={columnas} />
      )}

      <Modal
        abierto={formAbierto}
        titulo={editando ? "Editar categoría" : "Nueva categoría"}
        onCerrar={() => setFormAbierto(false)}
      >
        <CategoriaForm
          key={editando?.id ?? "nueva"}
          categoria={editando}
          onGuardado={() => setFormAbierto(false)}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>
    </div>
  );
}
