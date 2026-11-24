import { BadgeEstado } from "../../../shared/ui/BadgeEstado";
import { formatFecha, formatPrecio } from "../../../shared/utils/format";
import type { Pedido } from "../types/pedido";

export function PedidoDetalle({ pedido }: { pedido: Pedido }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center justify-between">
        <BadgeEstado estado={pedido.estado} />
        <span className="text-slate-500">{formatFecha(pedido.created_at)}</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="font-medium text-slate-600">Dirección</dt>
        <dd>{pedido.direccion_entrega}</dd>
        <dt className="font-medium text-slate-600">Forma de pago</dt>
        <dd>{pedido.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"}</dd>
        {pedido.notas && (
          <>
            <dt className="font-medium text-slate-600">Notas</dt>
            <dd>{pedido.notas}</dd>
          </>
        )}
      </dl>
      <table className="w-full">
        <thead className="text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="py-1">Producto</th>
            <th className="py-1 text-right">Cant.</th>
            <th className="py-1 text-right">Precio</th>
            <th className="py-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pedido.items.map((item) => (
            <tr key={item.producto_id}>
              <td className="py-1.5">{item.nombre_producto}</td>
              <td className="py-1.5 text-right">{item.cantidad}</td>
              <td className="py-1.5 text-right">{formatPrecio(item.precio_unitario)}</td>
              <td className="py-1.5 text-right">{formatPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-right text-base font-bold">Total: {formatPrecio(pedido.total)}</p>
    </div>
  );
}
