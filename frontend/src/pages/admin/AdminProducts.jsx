import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiAdmin from "../../api/apiAdmin";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    apiAdmin
      .get("/products") // ✅ /api/admin/products
      .then((res) => setProducts(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= ACTIVAR / DESACTIVAR (NO BORRA) ================= */
  const toggleProduct = async (product) => {
    const confirmMsg = product.isActive
      ? "¿Ocultar este producto del ecommerce?"
      : "¿Volver a mostrar este producto en el ecommerce?";

    if (!confirm(confirmMsg)) return;

    try {
      // ✅ Endpoint correcto: PATCH toggle
      await apiAdmin.patch(`/products/${product.id}/toggle`);
      loadProducts();
    } catch (error) {
      console.error("❌ toggleProduct:", error);
      alert("Error al cambiar estado del producto");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Productos</h2>

        <Link
          to="/admin/products/new"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-semibold"
        >
          Nuevo producto
        </Link>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        {loading ? (
          <p className="p-6 text-gray-500">Cargando productos…</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Producto</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Variantes</th>
                <th className="p-3">Categorías</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No hay productos
                  </td>
                </tr>
              )}

              {products.map((p) => (
                <tr
                  key={p.id}
                  className={`border-t ${
                    !p.isActive ? "bg-gray-50 text-gray-500" : ""
                  }`}
                >
                  {/* PRODUCTO */}
                  <td className="p-3">
                    <p className="font-medium">{p.name}</p>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.isOffer && <Badge color="red">Oferta</Badge>}
                      {p.isNew && <Badge color="green">Nuevo</Badge>}
                      {p.isPack && <Badge color="purple">Pack</Badge>}
                    </div>
                  </td>

                  {/* PRECIO */}
                  <td className="p-3">
                    <div>Bs {p.basePrice}</div>
                    {p.oldPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        Bs {p.oldPrice}
                      </div>
                    )}
                  </td>

                  {/* STOCK */}
                  <td className="p-3">{p.hasVariants ? "—" : p.stock}</td>

                  {/* VARIANTES */}
                  <td className="p-3">
                    {p.hasVariants ? (
                      <div>
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {p.ProductVariants?.length || 0} variantes
                        </span>

                        <div className="text-xs text-gray-600 mt-1">
                          {(p.ProductVariants || [])
                            .slice(0, 3)
                            .map((v) => (
                              <span key={v.id} className="mr-1">
                                {v.value}
                              </span>
                            ))}
                          {(p.ProductVariants || []).length > 3 && "…"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">
                        Sin variantes
                      </span>
                    )}
                  </td>

                  {/* CATEGORÍAS */}
                  <td className="p-3">
                    {(p.Categories || []).length === 0 ? (
                      <span className="text-xs text-gray-500">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {p.Categories.map((c) => (
                          <span
                            key={c.id}
                            className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* ESTADO */}
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {p.isActive ? "Activo" : "Oculto"}
                    </span>
                  </td>

                  {/* ACCIONES */}
                  <td className="p-3 text-right space-x-3 whitespace-nowrap">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => toggleProduct(p)}
                      className={`hover:underline ${
                        p.isActive ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {p.isActive ? "Ocultar" : "Activar"}
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

/* ===== BADGE ===== */
function Badge({ children, color }) {
  const colors = {
    red: "bg-red-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
  };

  return (
    <span className={`${colors[color]} text-white text-xs px-2 py-1 rounded`}>
      {children}
    </span>
  );
}
