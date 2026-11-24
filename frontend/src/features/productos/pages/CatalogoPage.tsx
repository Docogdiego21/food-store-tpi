import { useState, type FormEvent } from "react";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Paginacion } from "../../../shared/components/Paginacion";
import { Skeleton } from "../../../shared/components/Skeleton";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { ProductoCard } from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";

const LIMITE = 12;

export function CatalogoPage() {
  const [texto, setTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);
  const [pagina, setPagina] = useState(0);

  const categorias = useCategorias();
  const productos = useProductos({
    skip: pagina * LIMITE,
    limit: LIMITE,
    search: busqueda || undefined,
    categoria_id: categoriaId,
  });

  const buscar = (e: FormEvent) => {
    e.preventDefault();
    setBusqueda(texto.trim());
    setPagina(0);
  };

  const limpiar = () => {
    setTexto("");
    setBusqueda("");
    setCategoriaId(undefined);
    setPagina(0);
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Catálogo</h1>
      <form onSubmit={buscar} className="mb-6 flex flex-wrap items-center gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar por nombre..."
          className="min-w-56 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
        />
        <select
          value={categoriaId ?? ""}
          onChange={(e) => {
            setCategoriaId(e.target.value ? Number(e.target.value) : undefined);
            setPagina(0);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categorias.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <Button type="submit">Buscar</Button>
        <Button variante="secundario" onClick={limpiar}>
          Limpiar
        </Button>
      </form>

      {productos.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : productos.isError ? (
        <EstadoError mensaje={handleApiError(productos.error)} onReintentar={() => void productos.refetch()} />
      ) : productos.data && productos.data.items.length === 0 ? (
        <EstadoVacio
          titulo="No encontramos productos"
          descripcion="Probá con otra búsqueda o con otra categoría."
          accion={
            <Button variante="secundario" onClick={limpiar}>
              Ver todo el catálogo
            </Button>
          }
        />
      ) : (
        productos.data && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {productos.data.items.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
            <Paginacion pagina={pagina} total={productos.data.total} limite={LIMITE} onCambiar={setPagina} />
          </>
        )
      )}
    </div>
  );
}
