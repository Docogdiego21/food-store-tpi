import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { Input } from "../../../shared/ui/Input";
import { mensajeError } from "../../../shared/utils/format";
import { registrarUsuario } from "../api/auth";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { username: "", full_name: "", email: "", password: "", confirmar: "" },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await registrarUsuario({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        });
        navigate("/login", { state: { registrado: true } });
      } catch (e) {
        setError(handleApiError(e));
      }
    },
  });

  return (
    <Card className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Crear cuenta</h1>
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
          validators={{
            onChange: ({ value }) =>
              value.trim().length < 3 ? "El usuario debe tener al menos 3 caracteres" : undefined,
          }}
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
          name="full_name"
          validators={{ onChange: ({ value }) => (value.trim().length === 0 ? "Ingresá tu nombre completo" : undefined) }}
        >
          {(field) => (
            <Input
              label="Nombre completo"
              name="full_name"
              autoComplete="name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={mensajeError(field.state.meta.errors)}
            />
          )}
        </form.Field>
        <form.Field
          name="email"
          validators={{ onChange: ({ value }) => (REGEX_EMAIL.test(value.trim()) ? undefined : "Email inválido") }}
        >
          {(field) => (
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={mensajeError(field.state.meta.errors)}
            />
          )}
        </form.Field>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 8 ? "La contraseña debe tener al menos 8 caracteres" : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              name="password"
              type="password"
              autoComplete="new-password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={mensajeError(field.state.meta.errors)}
            />
          )}
        </form.Field>
        <form.Field
          name="confirmar"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) =>
              value !== fieldApi.form.getFieldValue("password") ? "Las contraseñas no coinciden" : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Repetir contraseña"
              name="confirmar"
              type="password"
              autoComplete="new-password"
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
              {enviando ? "Creando cuenta..." : "Registrarme"}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-medium text-orange-600 hover:underline">
          Ingresá
        </Link>
      </p>
    </Card>
  );
}
