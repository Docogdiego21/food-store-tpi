import type { ReactNode } from "react";

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center">
      <p className="text-lg font-semibold text-slate-700">{titulo}</p>
      {descripcion && <p className="text-sm text-slate-500">{descripcion}</p>}
      {accion}
    </div>
  );
}
