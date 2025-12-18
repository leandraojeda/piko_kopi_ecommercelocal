
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import apiPublic from "../api/apiPublic";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <main className="bg-pink-50 min-h-screen">

      {/* ================= HERO ================= */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 gap-10 items-center bg-pink-100 rounded-2xl p-8">
          {/* TEXTO */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-pink-500 mb-4">
              Bienvenido a Piko Kopi!
            </h1>

            <p className="text-gray-700 text-base sm:text-lg mb-6">
              Somos una tienda de papelería y juguetería ubicada en la ciudad de Sucre.
              <br />
              También contamos con cápsulas y scoops, y realizamos envíos a toda Bolivia.
            </p>

            <Link
              to="/products"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg
                         bg-pink-600 text-white font-semibold
                         hover:bg-pink-700 transition"
            >
              Ver todos los productos
              <span className="text-lg transition-transform group-hover:translate-x-1">
                {">"}
              </span>
            </Link>
          </div>

          {/* VIDEO */}
          <div className="w-full h-72 rounded-xl overflow-hidden shadow-sm">
            <video
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= CATEGORÍAS (CARRUSEL CIRCULITOS) ================= */}
      <section className="max-w-6xl mx-auto px-4 -mt-6 pb-6">
        <CategoriesCirclesCarousel />
      </section>

      {/* ================= OFERTAS ================= */}
<section className="max-w-6xl mx-auto px-4 pt-4 pb-10">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-pink-500 w-full">
      OFERTAS
    </h2>

    <Link
      to="/products?filter=offer"
      className="text-pink-600 font-semibold hover:underline whitespace-nowrap"
    >
      Ver más →
    </Link>
  </div>

  <ProductsCarouselAuto mode="offer" />
</section>

      {/* ================= TODOS LOS PRODUCTOS ================= */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-pink-500 text-center">
            PRODUCTOS
          </h2>

          <Link
            to="/products"
            className="text-pink-600 font-semibold hover:underline"
          >
            Ver más →
          </Link>
        </div>

        <ProductsCarouselAuto />
      </section>




      {/* ================= GALERÍA DE IMÁGENES ================= */}
      <section className="w-full">
        <div className="grid grid-cols-3 sm:grid-cols-3 grid-rows-2">
          <img src="/img/galeria1.png" alt="Galería 1" className="w-full h-full object-cover" />
          <img src="/img/galeria2.png" alt="Galería 2" className="w-full h-full object-cover" />
          <img src="/img/galeria3.png" alt="Galería 3" className="w-full h-full object-cover" />
          <img src="/img/galeria4.png" alt="Galería 4" className="w-full h-full object-cover" />
          <img src="/img/galeria5.png" alt="Galería 5" className="w-full h-full object-cover" />
          <img src="/img/galeria6.png" alt="Galería 6" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* ================= BENEFICIOS ================= */}
      <section className="bg-pink-100/50 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {/* CAJA */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="14" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800">Gran variedad</p>
            <p className="text-xs text-gray-500">Papelería y juguetería</p>
          </div>

          {/* CAMIÓN */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h11v10H3z" />
                  <path d="M14 10h4l3 3v4h-7z" />
                  <circle cx="7" cy="19" r="1.5" />
                  <circle cx="18" cy="19" r="1.5" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800">Envíos nacionales</p>
            <p className="text-xs text-gray-500">A toda Bolivia</p>
          </div>

          {/* ESTRELLA */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800">Confianza</p>
            <p className="text-xs text-gray-500">Atención cercana</p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= CARRUSEL DE CATEGORÍAS EN CÍRCULOS ================= */
function CategoriesCirclesCarousel() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    apiPublic
      .get("/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("❌ Error cargando categorías:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStep = () => {
    const item = trackRef.current?.querySelector("[data-cat]");
    return item ? item.offsetWidth + 12 : 90; // +gap
  };

  const next = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= max - 5) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: getStep(), behavior: "smooth" });
  };

  const prev = () => {
    trackRef.current?.scrollBy({ left: -getStep(), behavior: "smooth" });
  };

  const pause = () => {
    pausedRef.current = true;
    clearInterval(timerRef.current);
    setTimeout(startAuto, 2500);
  };

  const startAuto = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) next();
    }, 2600);
    pausedRef.current = false;
  };

  useEffect(() => {
    if (!loading && categories.length) startAuto();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [loading, categories.length]);

  if (loading) return null;
  if (!categories.length) return null;

  return (
    <div className="relative">
      {/* IZQ */}
      <button
        onClick={() => {
          pause();
          prev();
        }}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full bg-white shadow
                   flex items-center justify-center hover:scale-105 transition"
        aria-label="Anterior categorías"
      >
        ‹
      </button>

      {/* Track sin scrollbar */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          onMouseDown={pause}
          onTouchStart={pause}
          className="flex gap-3 overflow-x-scroll scroll-smooth hide-scrollbar py-2"
        >
          {categories.map((cat) => {
            const img = cat.image || "/img/category-fallback.png"; // pon tu fallback real si quieres
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                data-cat
                className="shrink-0"
                title={cat.name}
              >
                <div
                  className="
                    w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                    rounded-full overflow-hidden
                    bg-white shadow-sm
                    ring-2 ring-pink-100
                    hover:ring-pink-300 hover:shadow transition
                  "
                >
                  <img
                    src={img}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* DER */}
      <button
        onClick={() => {
          pause();
          next();
        }}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 rounded-full bg-white shadow
                   flex items-center justify-center hover:scale-105 transition"
        aria-label="Siguiente categorías"
      >
        ›
      </button>
    </div>
  );
}

/* ================= CARRUSEL AUTOMÁTICO (SIN SCROLLBAR) ================= */
function ProductsCarouselAuto({ mode = "all" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    apiPublic
      .get("/products")
      .then((res) => {
        const all = res.data || [];
        const filtered =
          mode === "offer" ? all.filter((p) => p.isOffer) : all;

        setProducts(filtered);
      })
      .catch((err) => console.error("❌ Error cargando productos:", err))
      .finally(() => setLoading(false));
  }, [mode]);

  const getStep = () => {
    const card = trackRef.current?.querySelector("[data-card]");
    return card ? card.offsetWidth + 16 : 320;
  };

  const next = () => {
    const el = trackRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= max - 5) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: getStep(), behavior: "smooth" });
  };

  const prev = () => {
    trackRef.current?.scrollBy({ left: -getStep(), behavior: "smooth" });
  };

  const pause = () => {
    pausedRef.current = true;
    clearInterval(timerRef.current);
    setTimeout(startAuto, 2500);
  };

  const startAuto = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) next();
    }, 2800);
    pausedRef.current = false;
  };

  useEffect(() => {
    if (!loading && products.length) startAuto();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [loading, products.length]);

  if (loading) return <p className="text-gray-500">Cargando productos…</p>;
  if (!products.length)
    return (
      <p className="text-gray-500">
        {mode === "offer" ? "No hay ofertas disponibles." : "No hay productos."}
      </p>
    );

  return (
    <div className="relative">
      {/* IZQ */}
      <button
        onClick={() => {
          pause();
          prev();
        }}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full bg-white shadow
                   flex items-center justify-center hover:scale-105 transition"
        aria-label="Anterior"
      >
        ‹
      </button>

      {/* Track sin scrollbar */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          onMouseDown={pause}
          onTouchStart={pause}
          className="flex gap-4 overflow-x-scroll scroll-smooth snap-x snap-mandatory hide-scrollbar"
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-card
              className="
                snap-start shrink-0
                w-[calc((100%-1rem)/2)]
                md:w-[calc((100%-2rem)/3)]
                lg:w-[calc((100%-3rem)/4)]
              "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* DER */}
      <button
        onClick={() => {
          pause();
          next();
        }}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full bg-white shadow
                   flex items-center justify-center hover:scale-105 transition"
        aria-label="Siguiente"
      >
        ›
      </button>
    </div>
  );
}
