import { useState } from "react";
import { Link } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Paginacion } from "../../../shared/components/Paginacion";
import { Skeleton } from "../../../shared/components/Skeleton";
import { BadgeEstado } from "../../../shared/ui/BadgeEstado";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { Modal } from "../../../shared/ui/Modal";
import { formatFecha, formatPrecio } from "../../../shared/utils/format";
import { PedidoDetalle } from "../components/PedidoDetalle";
import { useCancelarPedido } from "../hooks/useCancelarPedido";
import { usePedidos } from "../hooks/usePedidos";
import type { Pedido } from "../types/pedido";

const LIMITE = 10;

export function MisPedidosPage() {
  const [pagina, setPagina] = useState(0);
  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const pedidos = usePedidos({ skip: pagina * LIMITE, limit: LIMITE });
  const cancelar = useCancelarPedido();

  const pedirCancelacion = (pedido: Pedido) => {
    if (!window.confirm(`¿Cancelar el pedido #${pedido.id}?`)) return;
    setMensaje(null);
    cancelar.mutate(pedido.id, {
      onSuccess: () => setMensaje({ tipo: "ok", texto: `El pedido #${pedido.id} fue cancelado.` }),
      onError: (e) => setMensaje({ tipo: "error", texto: handleApiError(e) }),
    });
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Mis pedidos</h1>
      {mensaje && (
        <p
          className={`mb-4 rounded-lg p-3 text-sm ${
            mensaje.tipo === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {mensaje.texto}
        </p>
      )}

      {pedidos.isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : pedidos.isError ? (
        <EstadoError mensaje={handleApiError(pedidos.error)} onReintentar={() => void pedidos.refetch()} />
      ) : pedidos.data && pedidos.data.items.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hiciste pedidos"
          accion={
            <Link to="/" className="font-medium text-orange-600 hover:underline">
              Ver el catálogo
            </Link>
          }
        />
      ) : (
        pedidos.data && (
          <>
            <div className="flex flex-col gap-3">
              {pedidos.data.items.map((pedido) => (
                <Card key={pedido.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">Pedido #{pedido.id}</p>
                    <p className="text-sm text-slate-500">{formatFecha(pedido.created_at)}</p>
                  </div>
                  <BadgeEstado estado={pedido.estado} />
                  <p className="font-bold">{formatPrecio(pedido.total)}</p>
                  <div className="flex gap-2">
                    <Button variante="secundario" onClick={() => setDetalle(pedido)}>
                      Ver detalle
                    </Button>
                    {pedido.estado === "PENDIENTE" && (
                      <Button variante="peligro" disabled={cancelar.isPending} onClick={() => pedirCancelacion(pedido)}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <Paginacion pagina={pagina} total={pedidos.data.total} limite={LIMITE} onCambiar={setPagina} />
          </>
        )
      )}

      <Modal abierto={detalle !== null} titulo={detalle ? `Pedido #${detalle.id}` : ""} onCerrar={() => setDetalle(null)}>
        {detalle && <PedidoDetalle pedido={detalle} />}
      </Modal>
    </div>
  );
}
