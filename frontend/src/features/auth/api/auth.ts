import { axiosInstance } from "../../../shared/api/axiosInstance";
import type { RegistroDatos, Usuario } from "../types/usuario";

export async function iniciarSesion(username: string, password: string): Promise<void> {
  const formulario = new URLSearchParams();
  formulario.append("username", username);
  formulario.append("password", password);
  await axiosInstance.post("/auth/token", formulario, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

export async function cerrarSesion(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

export async function obtenerPerfil(): Promise<Usuario> {
  const { data } = await axiosInstance.get<Usuario>("/auth/me");
  return data;
}

export async function registrarUsuario(datos: RegistroDatos): Promise<Usuario> {
  const { data } = await axiosInstance.post<Usuario>("/auth/register", datos);
  return data;
}
