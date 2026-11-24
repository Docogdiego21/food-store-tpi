import { handleApiError } from "../../../shared/api/handleApiError";
import { EstadoError } from "../../../shared/components/EstadoError";
import { Skeleton } from "../../../shared/components/Skeleton";
import { formatPrecio } from "../../../shared/utils/format";
import { TarjetaResumen } from "../components/TarjetaResumen";
import { useResumenPedidos } from "../hooks/useResumenPedidos";

export function AdminResumenPage() {
  const resumen = useResumenPedidos();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Resumen del negocio</h1>
      {resumen.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : resumen.isError ? (
        <EstadoError mensaje={handleApiError(resumen.error)} onReintentar={() => void resumen.refetch()} />
      ) : (
        resumen.data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TarjetaResumen titulo="Pendientes" valor={String(resumen.data.pendientes)} color="text-amber-600" />
            <TarjetaResumen titulo="En preparación" valor={String(resumen.data.en_preparacion)} color="text-blue-600" />
            <TarjetaResumen titulo="Entregados" valor={String(resumen.data.entregados)} color="text-green-600" />
            <TarjetaResumen titulo="Cancelados" valor={String(resumen.data.cancelados)} color="text-red-600" />
            <TarjetaResumen titulo="Pedidos de hoy" valor={String(resumen.data.pedidos_hoy)} />
            <TarjetaResumen titulo="Ingresos (entregados)" valor={formatPrecio(resumen.data.ingresos_entregados)} />
          </div>
        )
      )}
    </div>
  );
}
