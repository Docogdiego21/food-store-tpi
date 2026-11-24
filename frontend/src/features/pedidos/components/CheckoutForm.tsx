import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { mensajeError } from "../../../shared/utils/format";
import type { ItemCarrito } from "../../../store/cartStore";
import { useCrearPedido } from "../hooks/useCrearPedido";
import type { FormaPago } from "../types/pedido";

interface CheckoutFormProps {
  items: ItemCarrito[];
  onCreado: () => void;
}

export function CheckoutForm({ items, onCreado }: CheckoutFormProps) {
  const crearPedido = useCrearPedido();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { direccion_entrega: "", forma_pago: "EFECTIVO" as FormaPago, notas: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await crearPedido.mutateAsync({
          items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || null,
        });
        onCreado();
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
      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length;
            if (largo < 5) return "La dirección debe tener al menos 5 caracteres";
            if (largo > 200) return "La dirección no puede superar los 200 caracteres";
            return undefined;
          },
        }}
      >
        {(field) => (
          <Input
            label="Dirección de entrega"
            name="direccion_entrega"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={mensajeError(field.state.meta.errors)}
          />
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="forma_pago" className="text-sm font-medium text-slate-700">
              Forma de pago
            </label>
            <select
              id="forma_pago"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as FormaPago)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="notas">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="notas" className="text-sm font-medium text-slate-700">
              Notas (opcional)
            </label>
            <textarea
              id="notas"
              rows={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        )}
      </form.Field>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(enviando) => (
          <Button type="submit" disabled={enviando}>
            {enviando ? "Confirmando..." : "Confirmar pedido"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
