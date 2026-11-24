import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { mensajeError } from "../../../shared/utils/format";
import type { Categoria } from "../../categorias/types/categoria";
import { useActualizarProducto, useCrearProducto } from "../hooks/useProductos";
import type { Producto } from "../types/producto";

interface ProductoFormProps {
  producto: Producto | null;
  categorias: Categoria[];
  onGuardado: () => void;
  onCancelar: () => void;
}

export function ProductoForm({ producto, categorias, onGuardado, onCancelar }: ProductoFormProps) {
  const crear = useCrearProducto();
  const actualizar = useActualizarProducto();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      categoria_id: producto?.categoria_id ?? categorias[0]?.id ?? 0,
      precio_base: producto?.precio_base ?? 0,
      stock: producto?.stock ?? 0,
      imagen_url: producto?.imagen_url ?? "",
      disponible: producto?.disponible ?? true,
    },
    onSubmit: async ({ value }) => {
      setError(null);
      const datos = {
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
        categoria_id: value.categoria_id,
        precio_base: value.precio_base,
        stock: value.stock,
        imagen_url: value.imagen_url.trim() || null,
        disponible: value.disponible,
      };
      try {
        if (producto) {
          await actualizar.mutateAsync({ id: producto.id, datos });
        } else {
          await crear.mutateAsync(datos);
        }
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
      <form.Field
        name="nombre"
        validators={{ onChange: ({ value }) => (value.trim().length === 0 ? "El nombre es obligatorio" : undefined) }}
      >
        {(field) => (
          <Input
            label="Nombre"
            name="nombre"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={mensajeError(field.state.meta.errors)}
          />
        )}
      </form.Field>
      <form.Field name="descripcion">
        {(field) => (
          <Input
            label="Descripción"
            name="descripcion"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
      <form.Field
        name="categoria_id"
        validators={{ onChange: ({ value }) => (value > 0 ? undefined : "Elegí una categoría") }}
      >
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="categoria_id" className="text-sm font-medium text-slate-700">
              Categoría
            </label>
            <select
              id="categoria_id"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {mensajeError(field.state.meta.errors) && (
              <span className="text-xs text-red-600">{mensajeError(field.state.meta.errors)}</span>
            )}
          </div>
        )}
      </form.Field>
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="precio_base"
          validators={{ onChange: ({ value }) => (value >= 0 ? undefined : "El precio no puede ser negativo") }}
        >
          {(field) => (
            <Input
              label="Precio"
              name="precio_base"
              type="number"
              min={0}
              step="0.01"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
              error={mensajeError(field.state.meta.errors)}
            />
          )}
        </form.Field>
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
      </div>
      <form.Field name="imagen_url">
        {(field) => (
          <Input
            label="URL de la imagen"
            name="imagen_url"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>
      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
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
