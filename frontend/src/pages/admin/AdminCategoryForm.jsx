import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiAdmin from "../../api/apiAdmin";

export default function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";

  const [name, setName] = useState("");
  const [image, setImage] = useState(""); // ✅ si no lo usas, igual no molesta
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    setLoadingCategory(true);

    apiAdmin
      .get(`/categories/${id}`) // ✅ SIN /admin
      .then((res) => {
        setName(res.data?.name ?? "");
        setImage(res.data?.image ?? "");
        setIsActive(res.data?.isActive ?? true);
      })
      .catch((err) => {
        console.error("❌ load category:", err);
        alert("Error al cargar categoría");
      })
      .finally(() => setLoadingCategory(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        image: image || null,
        isActive,
      };

      if (isEdit) {
        await apiAdmin.put(`/categories/${id}`, payload); // ✅ SIN /admin
      } else {
        await apiAdmin.post("/categories", payload); // ✅ SIN /admin
      }

      navigate("/admin/categories");
    } catch (err) {
      console.error("❌ save category:", err);
      alert("Error al guardar categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {isEdit ? "Editar categoría" : "Nueva categoría"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Completa el nombre (y opcionalmente una imagen).
        </p>

        {loadingCategory ? (
          <div className="p-4 text-gray-600">Cargando categoría...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nombre">
              <input
                className="w-full border rounded-xl px-4 py-2 mt-1
                           focus:outline-none focus:ring-2 focus:ring-pink-200
                           border-pink-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ej: Papelería"
              />
            </Field>

            <Field label="Imagen (URL) (opcional)">
              <input
                className="w-full border rounded-xl px-4 py-2 mt-1
                           focus:outline-none focus:ring-2 focus:ring-pink-200
                           border-pink-100"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <label className="flex items-center gap-3 bg-pink-50 border border-pink-100 rounded-xl px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive((v) => !v)}
              />
              <span className="text-sm text-gray-700">
                Categoría activa (visible en la tienda)
              </span>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t border-pink-100">
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="px-4 py-2 border rounded-xl bg-white hover:bg-pink-50 transition"
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                disabled={loading}
                className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-semibold transition disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}
