import { useEffect, useState } from "react";
import apiPublic from "../api/apiPublic";
import { Link } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiPublic
      .get("/categories")
      .then((res) => setCategories(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* TÍTULO */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-pink-600">
          Categorías
        </h2>
        <p className="text-gray-500 mt-2">
          Explora nuestros productos por categoría
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">
          Cargando categorías…
        </p>
      )}

      {/* GRID DE CATEGORÍAS */}
      {!loading && (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            gap-6
          "
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="
                group
                relative
                aspect-square
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-xl
                transition
              "
            >
              {/* IMAGEN */}
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="
                    w-full h-full object-cover
                    group-hover:scale-105
                    transition-transform duration-300
                  "
                />
              ) : (
                <div
                  className="
                    w-full h-full
                    bg-pink-100
                    flex items-center justify-center
                    text-pink-400 font-semibold
                  "
                >
                  Sin imagen
                </div>
              )}

              {/* OVERLAY */}
              <div
                className="
                  absolute inset-0
                  bg-black/40
                  flex items-center justify-center
                "
              >
                <span
                  className="
                    text-white
                    text-lg sm:text-xl
                    font-bold
                    text-center
                    px-4
                  "
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && categories.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No hay categorías registradas
        </p>
      )}
    </div>
  );
}
