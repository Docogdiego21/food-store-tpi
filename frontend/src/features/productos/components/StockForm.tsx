import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { mensajeError } from "../../../shared/utils/format";
import { useActualizarStock } from "../hooks/useProductos";
import type { Producto } from "../types/producto";

interface StockFormProps {
  producto: Producto;
  onGuardado: () => void;
  onCancelar: () => void;
}

export function StockForm({ producto, onGuardado, onCancelar }: StockFormProps) {
  const actualizar = useActualizarStock();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { stock: producto.stock, disponible: producto.disponible },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await actualizar.mutateAsync({ id: producto.id, datos: value });
        onGuardado();
      } catch (e) {
        setError(handleApiError(e));
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <p className="text-sm text-slate-600">{producto.nombre}</p>
      <form.Field
        name="stock"
        validators={{
          onChange: ({ value }) =>
            Number.isInteger(value) && value >= 0 ? undefined : "El stock debe ser un entero mayor o igual a 0",
        }}
      >
        {(field) => (
          <Input
            label="Stock"
            name="stock"
            type="number"
            min={0}
            step="1"
            value={field.state.value}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            onBlur={field.handleBlur}
            error={mensajeError(field.state.meta.errors)}
          />
        )}
      </form.Field>
      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={field.state.value} onChange={(e) => field.handleChange(e.target.checked)} />
            Disponible para la venta
          </label>
        )}
      </form.Field>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(enviando) => (
            <Button type="submit" disabled={enviando}>
              {enviando ? "Guardando..." : "Guardar"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
