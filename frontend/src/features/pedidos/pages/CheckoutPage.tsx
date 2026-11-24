import { Link, useNavigate } from "react-router-dom";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Card } from "../../../shared/ui/Card";
import { formatPrecio } from "../../../shared/utils/format";
import { useCartStore } from "../../../store/cartStore";
import { CheckoutForm } from "../components/CheckoutForm";

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const vaciar = useCartStore((s) => s.vaciar);
  const total = useCartStore((s) => s.items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0));

  if (items.length === 0) {
    return (
      <EstadoVacio
        titulo="No hay productos para pedir"
        descripcion="Agregá productos al carrito antes de confirmar."
        accion={
          <Link to="/" className="font-medium text-orange-600 hover:underline">
            Ir al catálogo
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Confirmar pedido</h1>
        <Card className="p-5">
          <CheckoutForm
            items={items}
            onCreado={() => {
              vaciar();
              navigate("/mis-pedidos");
            }}
          />
        </Card>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Resumen</h2>
        <Card className="divide-y divide-slate-100">
          {items.map((i) => (
            <div key={i.producto_id} className="flex justify-between gap-3 p-4 text-sm">
              <span>
                {i.cantidad} × {i.nombre}
              </span>
              <span className="font-medium">{formatPrecio(i.precio_unitario * i.cantidad)}</span>
            </div>
          ))}
          <div className="flex justify-between p-4 text-base font-bold">
            <span>Total</span>
            <span>{formatPrecio(total)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
