const moneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

export function formatPrecio(valor: number): string {
  return moneda.format(valor);
}

export function formatFecha(iso: string): string {
  const conZona = /Z|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  return new Date(conZona).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
}

export function mensajeError(errores: unknown[]): string | undefined {
  const textos = errores
    .map((e) => {
      if (typeof e === "string") return e;
      if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
      return "";
    })
    .filter((t) => t.length > 0);
  return textos.length > 0 ? textos.join(", ") : undefined;
}
