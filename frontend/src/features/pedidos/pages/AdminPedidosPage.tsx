import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { Paginacion } from "../../../shared/components/Paginacion";
import { Skeleton } from "../../../shared/components/Skeleton";
import { Modal } from "../../../shared/ui/Modal";
import { PedidoDetalle } from "../components/PedidoDetalle";
import { TablaPedidos } from "../components/TablaPedidos";
import { useCambiarEstadoPedido } from "../hooks/useCambiarEstadoPedido";
import { usePedidos } from "../hooks/usePedidos";
import type { EstadoPedido, Pedido } from "../types/pedido";

const LIMITE = 20;
const ESTADOS: EstadoPedido[] = ["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"];

export function AdminPedidosPage() {
  const [pagina, setPagina] = useState(0);
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined);
  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  const pedidos = usePedidos({ skip: pagina * LIMITE, limit: LIMITE, estado });
  const cambiarEstado = useCambiarEstadoPedido();

  const manejarCambio = (pedido: Pedido, nuevo: EstadoPedido) => {
    if (nuevo === "CANCELADO" && !window.confirm(`¿Cancelar el pedido #${pedido.id}? Se restituye el stock.`)) return;
    setError(null);
    setProcesandoId(pedido.id);
    cambiarEstado.mutate(
      { id: pedido.id, estado: nuevo },
      {
        onError: (e) => setError(handleApiError(e)),
        onSettled: () => setProcesandoId(null),
      },
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <select
          value={estado ?? ""}
          onChange={(e) => {
            setEstado(e.target.value ? (e.target.value as EstadoPedido) : undefined);
            setPagina(0);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {pedidos.isLoading ? (
        <Skeleton className="h-64" />
      ) : pedidos.isError ? (
        <EstadoError mensaje={handleApiError(pedidos.error)} onReintentar={() => void pedidos.refetch()} />
      ) : pedidos.data && pedidos.data.items.length === 0 ? (
        <EstadoVacio titulo="No hay pedidos para mostrar" />
      ) : (
        pedidos.data && (
          <>
            <TablaPedidos
              pedidos={pedidos.data.items}
              procesandoId={procesandoId}
              onVerDetalle={setDetalle}
              onCambiarEstado={manejarCambio}
            />
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
