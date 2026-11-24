import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { UnauthorizedPage } from "../features/auth/pages/UnauthorizedPage";
import { AdminCategoriasPage } from "../features/categorias/pages/AdminCategoriasPage";
import { AdminPedidosPage } from "../features/pedidos/pages/AdminPedidosPage";
import { AdminResumenPage } from "../features/pedidos/pages/AdminResumenPage";
import { CarritoPage } from "../features/pedidos/pages/CarritoPage";
import { CheckoutPage } from "../features/pedidos/pages/CheckoutPage";
import { MisPedidosPage } from "../features/pedidos/pages/MisPedidosPage";
import { AdminProductosPage } from "../features/productos/pages/AdminProductosPage";
import { CatalogoPage } from "../features/productos/pages/CatalogoPage";
import { AdminUsuariosPage } from "../features/usuarios/pages/AdminUsuariosPage";
import { MainLayout } from "../shared/layout/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

function NoEncontrada() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <Link to="/" className="mt-3 inline-block text-orange-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/mis-pedidos" element={<MisPedidosPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin/resumen" element={<AdminResumenPage />} />
            <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
            <Route path="/admin/productos" element={<AdminProductosPage />} />
            <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
            <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          </Route>

          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
