import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { formatPrecio } from "../../../shared/utils/format";
import { useCartStore } from "../../../store/cartStore";
import type { Producto } from "../types/producto";

export function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((s) => s.agregar);
  const enCarrito = useCartStore((s) => s.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0);
  const [imagenRota, setImagenRota] = useState(false);
  const agotado = !producto.disponible || producto.stock <= 0;
  const limiteAlcanzado = enCarrito >= producto.stock;

  return (
    <Card className="flex flex-col overflow-hidden">
      {producto.imagen_url && !imagenRota ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-40 w-full object-cover"
          onError={() => setImagenRota(true)}
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">Sin imagen</div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          {producto.categoria && (
            <span className="text-xs font-semibold uppercase text-orange-600">{producto.categoria.nombre}</span>
          )}
          <h3 className="font-semibold">{producto.nombre}</h3>
          {producto.descripcion && <p className="text-sm text-slate-500">{producto.descripcion}</p>}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold">{formatPrecio(producto.precio_base)}</span>
          <span className="text-xs text-slate-500">{agotado ? "Sin stock" : `Stock: ${producto.stock}`}</span>
        </div>
        <Button
          disabled={agotado || limiteAlcanzado}
          onClick={() =>
            agregar({
              producto_id: producto.id,
              nombre: producto.nombre,
              precio_unitario: producto.precio_base,
              imagen_url: producto.imagen_url,
              stock: producto.stock,
            })
          }
        >
          {agotado ? "No disponible" : limiteAlcanzado ? "Máximo en carrito" : "Agregar al carrito"}
        </Button>
        {enCarrito > 0 && <p className="text-center text-xs text-slate-500">En el carrito: {enCarrito}</p>}
      </div>
    </Card>
  );
}
