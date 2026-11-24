import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../shared/components/DataTable";
import { BadgeEstado } from "../../../shared/ui/BadgeEstado";
import { Button } from "../../../shared/ui/Button";
import { formatFecha, formatPrecio } from "../../../shared/utils/format";
import { TRANSICIONES, type EstadoPedido, type Pedido } from "../types/pedido";

interface TablaPedidosProps {
  pedidos: Pedido[];
  procesandoId: number | null;
  onVerDetalle: (pedido: Pedido) => void;
  onCambiarEstado: (pedido: Pedido, estado: EstadoPedido) => void;
}

const ETIQUETA_ACCION: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "Pasar a preparación",
  ENTREGADO: "Marcar entregado",
  CANCELADO: "Cancelar",
};

export function TablaPedidos({ pedidos, procesandoId, onVerDetalle, onCambiarEstado }: TablaPedidosProps) {
  const columnas: ColumnDef<Pedido>[] = [
    { header: "#", cell: ({ row }) => `#${row.original.id}` },
    { header: "Cliente", cell: ({ row }) => `Usuario ${row.original.usuario_id}` },
    { header: "Fecha", cell: ({ row }) => formatFecha(row.original.created_at) },
    {
      header: "Pago",
      cell: ({ row }) => (row.original.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"),
    },
    { header: "Total", cell: ({ row }) => formatPrecio(row.original.total) },
    { header: "Estado", cell: ({ row }) => <BadgeEstado estado={row.original.estado} /> },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const pedido = row.original;
        return (
          <div className="flex flex-wrap gap-2">
            <Button variante="fantasma" onClick={() => onVerDetalle(pedido)}>
              Detalle
            </Button>
            {TRANSICIONES[pedido.estado].map((siguiente) => (
              <Button
                key={siguiente}
                variante={siguiente === "CANCELADO" ? "peligro" : "primario"}
                disabled={procesandoId === pedido.id}
                onClick={() => onCambiarEstado(pedido, siguiente)}
              >
                {ETIQUETA_ACCION[siguiente]}
              </Button>
            ))}
          </div>
        );
      },
    },
  ];

  return <DataTable data={pedidos} columns={columnas} pageSize={100} />;
}
