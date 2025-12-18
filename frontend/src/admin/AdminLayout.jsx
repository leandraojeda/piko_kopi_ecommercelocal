import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Panel Admin</h2>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2 text-sm">
          <Link to="/admin" className="block hover:text-gray-300">
            📊 Dashboard
          </Link>
          <Link to="/admin/products" className="block hover:text-gray-300">
            📦 Productos
          </Link>
          <Link to="/admin/categories" className="block hover:text-gray-300">
            🗂 Categorías
          </Link>
          <Link to="/admin/orders" className="block hover:text-gray-300">
            🧾 Órdenes
          </Link>
          <Link to="/admin/users" className="block hover:text-gray-300">
            👥 Usuarios
          </Link>
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          {/* 🛒 VOLVER A LA TIENDA */}
          <Link
            to="/"
            className="block text-center bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold"
          >
            🛒 Volver a la tienda
          </Link>

          {/* 🚪 LOGOUT */}
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
