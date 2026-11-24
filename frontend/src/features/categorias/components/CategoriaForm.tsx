import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { mensajeError } from "../../../shared/utils/format";
import { useActualizarCategoria, useCrearCategoria } from "../hooks/useCategorias";
import type { Categoria } from "../types/categoria";

interface CategoriaFormProps {
  categoria: Categoria | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

export function CategoriaForm({ categoria, onGuardado, onCancelar }: CategoriaFormProps) {
  const crear = useCrearCategoria();
  const actualizar = useActualizarCategoria();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { nombre: categoria?.nombre ?? "", descripcion: categoria?.descripcion ?? "" },
    onSubmit: async ({ value }) => {
      setError(null);
      const datos = { nombre: value.nombre.trim(), descripcion: value.descripcion.trim() || null };
      try {
        if (categoria) {
          await actualizar.mutateAsync({ id: categoria.id, datos });
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
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length;
            if (largo < 2 || largo > 100) return "El nombre debe tener entre 2 y 100 caracteres";
            return undefined;
          },
        }}
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
