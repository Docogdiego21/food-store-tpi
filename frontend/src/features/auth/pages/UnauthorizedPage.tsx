import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Sin permiso</h1>
      <p className="mt-2 text-slate-600">No tenés permisos para acceder a esta sección.</p>
      <Link to="/" className="mt-4 inline-block font-medium text-orange-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
