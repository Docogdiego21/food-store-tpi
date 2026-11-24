import { Button } from "../ui/Button";

interface PaginacionProps {
  pagina: number;
  total: number;
  limite: number;
  onCambiar: (pagina: number) => void;
}

export function Paginacion({ pagina, total, limite, onCambiar }: PaginacionProps) {
  const paginas = Math.max(1, Math.ceil(total / limite));
  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-sm">
      <Button variante="secundario" disabled={pagina <= 0} onClick={() => onCambiar(pagina - 1)}>
        Anterior
      </Button>
      <span className="text-slate-600">
        Página {pagina + 1} de {paginas} · {total} resultados
      </span>
      <Button variante="secundario" disabled={pagina + 1 >= paginas} onClick={() => onCambiar(pagina + 1)}>
        Siguiente
      </Button>
    </div>
  );
}
