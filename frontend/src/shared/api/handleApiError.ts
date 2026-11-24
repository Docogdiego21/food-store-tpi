import axios from "axios";

interface ErrorValidacion {
  msg: string;
  loc?: (string | number)[];
}

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "No se pudo conectar con el servidor";
    }
    const detail = (error.response.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      return (detail as ErrorValidacion[])
        .map((e) => (e.loc ? `${e.loc[e.loc.length - 1]}: ${e.msg}` : e.msg))
        .join(". ");
    }
    return `Error ${error.response.status}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado";
}
