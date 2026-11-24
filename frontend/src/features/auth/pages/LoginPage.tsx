import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { Input } from "../../../shared/ui/Input";
import { mensajeError } from "../../../shared/utils/format";
import { useAuthStore } from "../../../store/authStore";

interface EstadoNavegacion {
  from?: string;
  registrado?: boolean;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const estado = (location.state ?? {}) as EstadoNavegacion;
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await login(value.username.trim(), value.password);
        const usuario = useAuthStore.getState().usuario;
        const destino = estado.from ?? (usuario?.role === "admin" ? "/admin/resumen" : "/");
        navigate(destino, { replace: true });
      } catch (e) {
        setError(handleApiError(e));
      }
    },
  });

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Ingresar</h1>
      {estado.registrado && (
        <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Cuenta creada. Ya podés iniciar sesión.
        </p>
      )}
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="username"
          validators={{ onChange: ({ value }) => (value.trim().length === 0 ? "Ingresá tu usuario" : undefined) }}
        >
          {(field) => (
            <Input
              label="Usuario"
              name="username"
              autoComplete="username"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={mensajeError(field.state.meta.errors)}
            />
          )}
        </form.Field>
        <form.Field
          name="password"
          validators={{ onChange: ({ value }) => (value.length === 0 ? "Ingresá tu contraseña" : undefined) }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="current-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={mensajeError(field.state.meta.errors)}
            />
          )}
        </form.Field>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(enviando) => (
            <Button type="submit" disabled={enviando}>
              {enviando ? "Ingresando..." : "Ingresar"}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="font-medium text-orange-600 hover:underline">
          Registrate
        </Link>
      </p>
    </Card>
  );
}
