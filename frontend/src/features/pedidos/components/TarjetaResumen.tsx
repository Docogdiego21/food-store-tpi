import { Card } from "../../../shared/ui/Card";

interface TarjetaResumenProps {
  titulo: string;
  valor: string;
  color?: string;
}

export function TarjetaResumen({ titulo, valor, color = "text-slate-800" }: TarjetaResumenProps) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{valor}</p>
    </Card>
  );
}
