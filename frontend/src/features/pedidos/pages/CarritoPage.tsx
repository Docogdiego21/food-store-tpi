import { Link } from "react-router-dom";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { formatPrecio } from "../../../shared/utils/format";
import { useCartStore } from "../../../store/cartStore";

export function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
  const quitar = useCartStore((s) => s.quitar);
  const vaciar = useCartStore((s) => s.vaciar);
  const total = useCartStore((s) => s.items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0));

  if (items.length === 0) {
    return (
      <EstadoVacio
        titulo="Tu carrito está vacío"
        descripcion="Agregá productos desde el catálogo."
        accion={
          <Link to="/" className="font-medium text-orange-600 hover:underline">
            Ir al catálogo
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Carrito</h1>
      <Card className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.producto_id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-40 flex-1">
              <p className="font-semibold">{item.nombre}</p>
              <p className="text-sm text-slate-500">{formatPrecio(item.precio_unitario)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variante="secundario"
                aria-label="Restar"
                disabled={item.cantidad <= 1}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
              >
                −
              </Button>
              <span className="w-8 text-center font-medium">{item.cantidad}</span>
              <Button
                variante="secundario"
                aria-label="Sumar"
                disabled={item.cantidad >= item.stock}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
              >
                +
              </Button>
            </div>
            <p className="w-28 text-right font-semibold">{formatPrecio(item.precio_unitario * item.cantidad)}</p>
            <Button variante="fantasma" onClick={() => quitar(item.producto_id)}>
              Quitar
            </Button>
          </div>
        ))}
      </Card>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button variante="secundario" onClick={vaciar}>
          Vaciar carrito
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold">Total: {formatPrecio(total)}</p>
          <Link
            to="/checkout"
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            Continuar con el pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
