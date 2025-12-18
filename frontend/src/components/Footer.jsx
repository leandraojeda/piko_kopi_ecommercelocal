export default function Footer() {
  return (
    <footer className="bg-pink-900 text-gray-300 mt-16">
      {/* CONTENIDO */}
      <div
        className="max-w-6xl mx-auto px-4 py-12
                   grid gap-10 sm:grid-cols-2 md:grid-cols-4"
      >
        {/* MARCA */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">
            Piko Kopi
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Cápsulas y accesorios seleccionados para acompañarte
            en cada momento del día.
          </p>
        </div>

        {/* NAVEGACIÓN */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            Navegación
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                className="hover:text-pink-400 transition"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="hover:text-pink-400 transition"
              >
                Productos
              </a>
            </li>
            <li>
              <a
                href="/cart"
                className="hover:text-pink-400 transition"
              >
                Carrito
              </a>
            </li>
          </ul>
        </div>

        {/* CATEGORÍAS */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            Categorías
          </h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-pink-400 transition cursor-pointer">
              Café
            </li>
            <li className="hover:text-pink-400 transition cursor-pointer">
              Cápsulas
            </li>
            <li className="hover:text-pink-400 transition cursor-pointer">
              Accesorios
            </li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h4 className="font-semibold text-white mb-3">
            Contacto
          </h4>

          <ul className="space-y-3 text-sm">
            <li className="text-gray-400">
              Sucre, Bolivia
            </li>

            {/* WHATSAPP */}
            <li>
              <a
                href="https://wa.me/59169019059"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-400 transition"
              >
                <PhoneIcon />
                +591 69019059
              </a>
            </li>

            {/* EMAIL */}
            <li>
              <a
                href="mailto:pikokopi.store@gmail.com"
                className="flex items-center gap-2 hover:text-pink-400 transition"
              >
                <MailIcon />
                pikokopi.store@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Piko Kopi. Todos los derechos reservados.
      </div>
    </footer>
  );
}

/* ===== ICONOS ===== */
function PhoneIcon() {
  return (
    <svg
      className="w-4 h-4 text-pink-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a1 1 0 00-1 1c0 5.523 4.477 10 10 10a1 1 0 001-1v-1a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className="w-4 h-4 text-pink-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l9 6 9-6"
      />
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        ry="2"
      />
    </svg>
  );
}
