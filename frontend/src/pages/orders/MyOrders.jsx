import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiPublic from "../../api/apiPublic";

const STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  completed: "Completado",
  cancelled: "Cancelado",
};

const STATUS_STYLES = {
  pending: "bg-pink-50 text-pink-700 border-pink-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

/* ===== ICONOS ROSITAS (SIN LIBRERÍAS) ===== */
function IconReceipt({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3h8a2 2 0 0 1 2 2v16l-2-1-2 1-2-1-2 1-2-1-2 1V5a2 2 0 0 1 2-2z" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

function IconEye({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4" />
      <path d="M9.9 4.3A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-3.2 4.3" />
      <path d="M6.2 6.2C3.7 8.1 2 12 2 12s3.5 7 10 7c1 0 2-.1 2.9-.4" />
    </svg>
  );
}

function IconDownload({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===== CARGAR MIS ÓRDENES ===== */
  const loadOrders = async () => {
    try {
      const res = await apiPublic.get("/orders/my");
      setOrders(res.data || []);
    } catch (error) {
      alert("Debes iniciar sesión");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, []);

  /* ===== VER / OCULTAR DETALLE ===== */
  const toggleDetails = async (id) => {
    if (openOrder?.id === id) {
      setOpenOrder(null);
      return;
    }

    try {
      const res = await apiPublic.get(`/orders/${id}`);
      setOpenOrder(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar detalle");
    }
  };

  /* ===== DESCARGAR PDF ===== */


  return (
    <div className="bg-pink-50 min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-pink-100 p-5 sm:p-7">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <IconReceipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Mis órdenes</h2>
              <p className="text-sm text-gray-500">Revisa el estado y el detalle de tus compras</p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Cargando órdenes…</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center mb-3">
              <IconReceipt className="w-7 h-7" />
            </div>
            <p className="text-gray-700 font-semibold">Aún no tienes órdenes</p>
            <p className="text-gray-500 text-sm mt-1">Cuando compres, aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const isOpen = openOrder?.id === o.id;
              const badge = STATUS_STYLES[o.status] || "bg-pink-50 text-pink-700 border-pink-200";

              return (
                <div
                  key={o.id}
                  className={`rounded-2xl border shadow-sm bg-white overflow-hidden ${
                    !o.isActive ? "opacity-80" : ""
                  }`}
                >
                  {/* CABECERA */}
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-semibold text-gray-800">
                            Orden <span className="text-pink-600">{o.code}</span>
                          </p>

                          <span className={`text-xs px-3 py-1 rounded-full border ${badge}`}>
                            {STATUS_LABELS[o.status]}
                          </span>
                        </div>

                        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                          <span>
                            Total:{" "}
                            <span className="font-semibold text-gray-800">Bs {o.total}</span>
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>
                            Fecha:{" "}
                            <span className="text-gray-700">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:gap-3 items-center justify-start lg:justify-end flex-wrap">
                        <button
                          onClick={() => toggleDetails(o.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                                     border border-pink-200 text-pink-700 bg-pink-50
                                     hover:bg-pink-100 transition text-sm font-semibold"
                        >
                          {isOpen ? <IconEyeOff /> : <IconEye />}
                          {isOpen ? "Ocultar detalle" : "Ver detalle"}
                        </button>

                        
                      </div>
                    </div>
                  </div>

                  {/* DETALLE */}
                  {isOpen && (
                    <div className="border-t border-pink-100 bg-pink-50/40">
                      <div className="p-4 sm:p-5 overflow-x-auto">
                        <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-pink-100">
                          <thead className="bg-pink-50 text-gray-700">
                            <tr>
                              <th className="p-3 text-left">Producto</th>
                              <th className="p-3 text-center">Cantidad</th>
                              <th className="p-3 text-right">Precio</th>
                              <th className="p-3 text-right">Subtotal</th>
                            </tr>
                          </thead>

                          <tbody>
                            {openOrder.items.map((i) => {
                              const img =
                                i.Product?.ProductImages?.[0]?.imageUrl ||
                                "https://via.placeholder.com/60";

                              return (
                                <tr key={i.id} className="border-t">
                                  <td className="p-3">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={img}
                                        className="w-14 h-14 object-cover rounded-xl border border-pink-100"
                                        alt=""
                                      />

                                      <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 line-clamp-1">
                                          {i.Product?.name}
                                        </p>

                                        {i.ProductVariant && (
                                          <p className="text-xs text-gray-500 mt-0.5">
                                            {i.ProductVariant.name}:{" "}
                                            <span className="text-gray-700">{i.ProductVariant.value}</span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  <td className="p-3 text-center font-medium text-gray-800">
                                    {i.quantity}
                                  </td>

                                  <td className="p-3 text-right text-gray-700">
                                    Bs {i.price}
                                  </td>

                                  <td className="p-3 text-right font-semibold text-pink-700">
                                    Bs {i.price * i.quantity}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        <div className="mt-4 text-xs text-gray-500 leading-relaxed">
                          Envío a coordinar por WhatsApp. <br />
                          Pago contra entrega o transferencia.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
