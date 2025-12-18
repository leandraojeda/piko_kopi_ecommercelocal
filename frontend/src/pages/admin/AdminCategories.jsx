import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiAdmin from "../../api/apiAdmin";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const res = await apiAdmin.get("/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
      alert("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteCategory = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;

    try {
      await apiAdmin.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar categoría:", error);
      alert("Error al eliminar categoría");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Categorías
          </h1>
          <p className="text-sm text-gray-500">
            Gestión de categorías del ecommerce
          </p>
        </div>

        <Link
          to="/admin/categories/new"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl
                     bg-pink-600 hover:bg-pink-700 text-white font-semibold transition"
        >
          + Nueva categoría
        </Link>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Cargando categorías…
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-pink-50 text-left text-gray-700">
              <tr>
                <th className="p-4">Imagen</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-gray-500"
                  >
                    No hay categorías registradas
                  </td>
                </tr>
              )}

              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t border-pink-50"
                >
                  {/* IMAGEN */}
                  <td className="p-4">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-lg object-cover border border-pink-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-pink-50
                                      flex items-center justify-center
                                      text-pink-300 text-xs border border-pink-100">
                        Sin foto
                      </div>
                    )}
                  </td>

                  {/* NOMBRE */}
                  <td className="p-4 font-semibold text-gray-800">
                    {cat.name}
                  </td>

                  {/* SLUG */}
                  <td className="p-4 text-gray-500">
                    {cat.slug}
                  </td>

                  {/* ACCIONES */}
                  <td className="p-4 text-right space-x-4">
                    <Link
                      to={`/admin/categories/${cat.id}`}
                      className="text-pink-700 hover:underline font-medium"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
