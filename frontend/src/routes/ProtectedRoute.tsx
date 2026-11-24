import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Rol } from "../features/auth/types/usuario";
import { Skeleton } from "../shared/components/Skeleton";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  roles?: Rol[];
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);
  const location = useLocation();

  if (cargando) {
    return (
      <div className="flex flex-col gap-3" role="status" aria-label="Verificando sesión">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}
