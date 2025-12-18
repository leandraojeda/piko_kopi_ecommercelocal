import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  // ✅ Leer user de localStorage de forma segura
  const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user_data"));
    } catch {
      return null;
    }
  };

  // ✅ Estado reactivo del usuario (se actualiza al instante)
  const [user, setUser] = useState(readUser);

  // ✅ Re-lee el usuario al cambiar de ruta (por si login navega)
  useEffect(() => {
    setUser(readUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ✅ Escucha cambios entre pestañas (login/logout en otra pestaña)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user_data" || e.key === null) {
        setUser(readUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ocultar navbar en panel admin
  if (location.pathname.startsWith("/admin")) return null;

  // Total real de productos
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  const logout = () => {
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_token");
    setUser(null); // ✅ se refleja al instante (sin recargar)
    navigate("/");
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* ===== FILA PRINCIPAL ===== */}
        <div className="min-h-[64px] flex items-center gap-4 flex-wrap md:flex-nowrap">
          {/* LOGO */}
          <Link to="/" className="shrink-0">
            <img
              src="/logo-pikokopi.png"
              alt="Piko Kopi"
              className="h-8 sm:h-9 w-auto"
            />
          </Link>

          {/* MENÚ */}
          <div
            className="flex flex-1 justify-center gap-x-6 gap-y-1
                       text-[11px] sm:text-sm font-medium text-gray-700
                       flex-wrap md:flex-nowrap"
          >
            <Link to="/" className="hover:text-pink-600 transition">
              INICIO
            </Link>

            <Link to="/products" className="hover:text-pink-600 transition">
              PRODUCTOS
            </Link>

            <Link to="/categories" className="hover:text-pink-600 transition">
              CATEGORÍAS
            </Link>

            {user && (
              <Link to="/my-orders" className="hover:text-pink-600 transition">
                MIS ÓRDENES
              </Link>
            )}
          </div>

          {/* CARRITO */}
          <Link to="/cart" className="relative shrink-0" title="Carrito">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-gray-700 hover:text-pink-600 transition"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>

            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2
                           bg-pink-600 text-white text-[11px]
                           w-5 h-5 rounded-full
                           flex items-center justify-center"
              >
                {totalItems}
              </span>
            )}
          </Link>

          {/* ✅ ICONO LOGIN (solo si NO hay sesión) */}
          {!user && (
            <Link to="/login" className="shrink-0" title="Iniciar sesión">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-gray-700 hover:text-pink-600 transition"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}
        </div>

        {/* ===== USUARIO ABAJO (CENTRADO) ===== */}
        {user && (
          <div className="flex justify-center items-center gap-3 pb-2 text-sm">
            <span className="font-semibold text-purple-900">
              Bienvenid@, {user.name}!
            </span>

            <button
              onClick={logout}
              title="Salir"
              className="text-red-600 hover:text-red-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
