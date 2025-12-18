import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="space-y-2">
          <Link to="/admin" className="block">Dashboard</Link>
          <Link to="/admin/products" className="block">Productos</Link>
          <Link to="/admin/categories" className="block">Categorías</Link>
          <Link to="/admin/orders" className="block">Órdenes</Link>
          <Link to="/admin/users" className="block">Usuarios</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {/* 👇 CLAVE */}
        <Outlet />
      </main>
    </div>
  );
}
