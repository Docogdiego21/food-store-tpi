import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { Button } from "../ui/Button";

const enlaceBase = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors";
const claseEnlace = ({ isActive }: { isActive: boolean }) =>
  `${enlaceBase} ${isActive ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-slate-100"}`;

const enlacesAdmin = [
  { to: "/admin/resumen", texto: "Resumen" },
  { to: "/admin/categorias", texto: "Categorías" },
  { to: "/admin/productos", texto: "Productos" },
  { to: "/admin/pedidos", texto: "Pedidos" },
  { to: "/admin/usuarios", texto: "Usuarios" },
];

export function Navbar() {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const cantidad = useCartStore((s) => s.items.reduce((acc, i) => acc + i.cantidad, 0));

  const cerrarSesion = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-orange-600">
            Food Store
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={claseEnlace}>
              Catálogo
            </NavLink>
            <NavLink to="/carrito" className={claseEnlace}>
              Carrito{cantidad > 0 && ` (${cantidad})`}
            </NavLink>
            {usuario && (
              <NavLink to="/mis-pedidos" className={claseEnlace}>
                Mis pedidos
              </NavLink>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {usuario ? (
            <>
              <span className="text-slate-600">
                {usuario.full_name}{" "}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-600">
                  {usuario.role}
                </span>
              </span>
              <Button variante="secundario" onClick={() => void cerrarSesion()}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseEnlace}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={claseEnlace}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </div>
      {usuario?.role === "admin" && (
        <div className="border-t border-slate-100 bg-slate-50">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-2">
            <span className="mr-2 text-xs font-semibold uppercase text-slate-500">Panel</span>
            {enlacesAdmin.map((e) => (
              <NavLink key={e.to} to={e.to} className={claseEnlace}>
                {e.texto}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
