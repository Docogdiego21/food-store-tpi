import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "peligro" | "fantasma";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const estilos: Record<Variante, string> = {
  primario: "bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-300",
  secundario: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 disabled:opacity-50",
  peligro: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  fantasma: "text-slate-600 hover:bg-slate-100 disabled:opacity-50",
};

export function Button({ variante = "primario", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
      {...props}
    />
  );
}
