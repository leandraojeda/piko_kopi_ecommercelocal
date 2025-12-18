import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiPublic from "../api/apiPublic";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ✅ categoryId viene desde /products?category=ID
  const categoryId = searchParams.get("category") || "";

  /* ===== CARGAR CATEGORÍAS (para mostrar nombre + selector) ===== */
  useEffect(() => {
    apiPublic
      .get("/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("❌ Error cargando categorías:", err));
  }, []);

  /* ===== CARGAR PRODUCTOS (backend real) ===== */
  useEffect(() => {
    setLoading(true);

    const params = {};
    if (categoryId) params.category = categoryId;

    apiPublic
      .get("/products", { params })
      .then((res) => setProducts(res.data || []))
      .catch((err) => {
        console.error("❌ Error cargando productos:", err);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  /* ===== FILTRO LOCAL (offer/new/pack) ===== */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filter === "offer") return p.isOffer;
      if (filter === "new") return p.isNew;
      if (filter === "pack") return p.isPack;
      return true;
    });
  }, [products, filter]);

  /* ===== UI: nombre de la categoría seleccionada ===== */
  const selectedCategoryName = useMemo(() => {
    if (!categoryId) return "";
    const found = categories.find((c) => String(c.id) === String(categoryId));
    return found?.name || "Categoría";
  }, [categoryId, categories]);

  const onChangeCategory = (value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete("category");
    else next.set("category", value);
    setSearchParams(next);
  };

  const clearCategory = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-pink-600">Productos</h2>

        {categoryId ? (
          <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-700">
              {selectedCategoryName}
            </span>

            <button
              onClick={clearCategory}
              className="text-sm text-gray-500 hover:text-pink-700 underline underline-offset-2"
            >
              Ver todos
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mt-2">Explora todo nuestro catálogo</p>
        )}
      </div>

      {/* ===== SELECTOR CATEGORÍA (opcional, pero útil) ===== */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-md">
          <select
            value={categoryId}
            onChange={(e) => onChangeCategory(e.target.value)}
            className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== FILTROS (offer/new/pack) ===== */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 flex-wrap justify-center">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            Todos
          </FilterButton>

          <FilterButton active={filter === "offer"} onClick={() => setFilter("offer")}>
            Ofertas
          </FilterButton>

          <FilterButton active={filter === "new"} onClick={() => setFilter("new")}>
            Nuevos
          </FilterButton>

          <FilterButton active={filter === "pack"} onClick={() => setFilter("pack")}>
            Packs
          </FilterButton>
        </div>
      </div>

      {/* ===== CONTENIDO ===== */}
      {loading ? (
        <p className="text-center text-gray-500">Cargando productos…</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay productos para este filtro.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== BOTÓN DE FILTRO ===== */
function FilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition
        ${
          active
            ? "bg-pink-600 text-white border-pink-600"
            : "bg-white text-gray-700 border-pink-200 hover:bg-pink-50"
        }`}
    >
      {children}
    </button>
  );
}
