import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { DataTable } from "../../../shared/components/DataTable";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Skeleton } from "../../../shared/components/Skeleton";
import { Button } from "../../../shared/ui/Button";
import { Modal } from "../../../shared/ui/Modal";
import { formatPrecio } from "../../../shared/utils/format";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { ProductoForm } from "../components/ProductoForm";
import { StockForm } from "../components/StockForm";
import { useEliminarProducto, useProductos } from "../hooks/useProductos";
import type { Producto } from "../types/producto";

export function AdminProductosPage() {
  const productos = useProductos({ skip: 0, limit: 100 });
  const categorias = useCategorias();
  const eliminar = useEliminarProducto();
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [stockDe, setStockDe] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abrirForm = (producto: Producto | null) => {
    setEditando(producto);
    setFormAbierto(true);
  };

  const pedirBaja = (producto: Producto) => {
    if (!window.confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) return;
    setError(null);
    eliminar.mutate(producto.id, { onError: (e) => setError(handleApiError(e)) });
  };

  const columnas: ColumnDef<Producto>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Nombre", cell: ({ row }) => <span className="font-medium">{row.original.nombre}</span> },
    { header: "Categoría", cell: ({ row }) => row.original.categoria?.nombre ?? "—" },
    { header: "Precio", cell: ({ row }) => formatPrecio(row.original.precio_base) },
    { header: "Stock", accessorKey: "stock" },
    {
      header: "Disponible",
      cell: ({ row }) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            row.original.disponible ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
          }`}
        >
          {row.original.disponible ? "Sí" : "No"}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button variante="secundario" onClick={() => abrirForm(row.original)}>
            Editar
          </Button>
          <Button variante="secundario" onClick={() => setStockDe(row.original)}>
            Stock
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
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button disabled={!categorias.data || categorias.data.length === 0} onClick={() => abrirForm(null)}>
          Nuevo producto
        </Button>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {productos.isLoading ? (
        <Skeleton className="h-64" />
      ) : productos.isError ? (
        <EstadoError mensaje={handleApiError(productos.error)} onReintentar={() => void productos.refetch()} />
      ) : productos.data && productos.data.items.length === 0 ? (
        <EstadoVacio titulo="Todavía no hay productos" />
      ) : (
        productos.data && <DataTable data={productos.data.items} columns={columnas} />
      )}

      <Modal
        abierto={formAbierto}
        titulo={editando ? "Editar producto" : "Nuevo producto"}
        onCerrar={() => setFormAbierto(false)}
      >
        <ProductoForm
          key={editando?.id ?? "nuevo"}
          producto={editando}
          categorias={categorias.data ?? []}
          onGuardado={() => setFormAbierto(false)}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>

      <Modal abierto={stockDe !== null} titulo="Stock y disponibilidad" onCerrar={() => setStockDe(null)}>
        {stockDe && (
          <StockForm
            key={stockDe.id}
            producto={stockDe}
            onGuardado={() => setStockDe(null)}
            onCancelar={() => setStockDe(null)}
          />
        )}
      </Modal>
    </div>
  );
}
