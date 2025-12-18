import { useEffect, useState } from "react";
import apiAdmin from "../../api/apiAdmin";

/* ===== ESTADOS ===== */
const STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  completed: "Completado",
  cancelled: "Cancelado",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===== CARGAR ÓRDENES ===== */
  const loadOrders = async () => {
    try {
      const res = await apiAdmin.get("/admin/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("❌ Error al cargar órdenes:", error);
      alert("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ===== FILTRAR ===== */
  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.code?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q)
    );
  });

  /* ===== CAMBIAR ESTADO ===== */
  const setStatus = async (id, status) => {
  try {
    if (status === "cancelled") {
      await apiAdmin.put(`/admin/orders/${id}/cancel`);
    } else {
      await apiAdmin.put(`/admin/orders/${id}/status`, { status });
    }

    await loadOrders();

    if (openOrder?.id === id) {
      const res = await apiAdmin.get(`/admin/orders/${id}`);
      setOpenOrder(res.data);
    }
  } catch (error) {
    console.error("❌ Error actualizando estado:", error);
    alert(
      error.response?.data?.message ||
      "Error al actualizar estado"
    );
  }
};


  /* ===== VER DETALLE ===== */
  const toggleDetails = async (id) => {
    if (openOrder?.id === id) {
      setOpenOrder(null);
      return;
    }

    try {
      const res = await apiAdmin.get(`/admin/orders/${id}`);
      setOpenOrder(res.data);
    } catch (error) {
      console.error("❌ Error cargando detalle:", error);
      alert("Error al cargar detalle");
    }
  };

  /* ===== DESCARGAR PDF ===== */
  const downloadPdf = async (id) => {
    try {
      const res = await apiAdmin.get(`/admin/orders/${id}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orden-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error descargando PDF:", error);
      alert("Error al descargar comprobante");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">📦 Órdenes</h2>

        {/* ===== BUSCADOR ===== */}
        <input
          type="text"
          placeholder="Buscar por código, cliente o teléfono…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-6"
        />

        {loading ? (
          <p>Cargando órdenes…</p>
        ) : filteredOrders.length === 0 ? (
          <p>No hay resultados</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((o) => (
              <div key={o.id} className="border rounded-lg p-4">
                {/* ===== CABECERA ===== */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      🧾 {o.code || "SIN-CÓDIGO"} — {o.customerName}
                    </p>
                    <p className="text-sm">Total: Bs {o.total}</p>
                    <p className="text-sm text-gray-500">
                      Estado: {STATUS_LABELS[o.status]}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      className="border rounded px-3 py-2"
                    >
                      {Object.entries(STATUS_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        )
                      )}
                    </select>

                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleDetails(o.id)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {openOrder?.id === o.id
                          ? "Ocultar detalle"
                          : "Ver detalle"}
                      </button>

                      <button
                        onClick={() => downloadPdf(o.id)}
                        className="text-green-600 text-sm hover:underline"
                      >
                        Descargar PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* ===== DETALLE ===== */}
                {openOrder?.id === o.id && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">Imagen</th>
                          <th className="p-2 border">Producto</th>
                          <th className="p-2 border text-center">Cantidad</th>
                          <th className="p-2 border text-right">Precio</th>
                          <th className="p-2 border text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {openOrder.items.map((i) => (
                          <tr key={i.id}>
                            <td className="p-2 border">
                              <img
                                src={
                                  i.Product?.ProductImages?.[0]?.imageUrl ||
                                  "https://via.placeholder.com/60"
                                }
                                className="w-14 h-14 object-cover rounded"
                                alt=""
                              />
                            </td>
                            <td className="p-2 border">
                              {i.Product?.name}
                              {i.ProductVariant && (
                                <div className="text-xs text-gray-500">
                                  {i.ProductVariant.name}:{" "}
                                  {i.ProductVariant.value}
                                </div>
                              )}
                            </td>
                            <td className="p-2 border text-center">
                              {i.quantity}
                            </td>
                            <td className="p-2 border text-right">
                              Bs {i.price}
                            </td>
                            <td className="p-2 border text-right font-semibold">
                              Bs {i.price * i.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
