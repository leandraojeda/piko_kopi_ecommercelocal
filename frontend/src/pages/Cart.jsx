import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import apiPublic from "../api/apiPublic";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    total,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!customer.name || !customer.phone) {
      alert("Nombre y teléfono son obligatorios");
      return;
    }

    if (cart.length === 0) {
      alert("Pedido realizado con éxito. Gracias por confiar en Piko Kopi ");
      return;
    }

    /* ===== PAYLOAD CORRECTO PARA BACKEND ===== */
    const payload = {
      customerName: customer.name,
      customerEmail: customer.email || null,
      phone: customer.phone,
      address: customer.address,
      items: cart.map((item) => ({
        productId: item.productId,
        variantId: item.variant?.id || null,
        quantity: item.quantity,
      })),
    };

    try {
      setLoading(true);

      const res = await apiPublic.post(
        "/orders",
        payload,
        { responseType: "blob" } // 👈 importante para PDF
      );


      // 🔑 obtener código de orden desde el header
const orderCode = res.headers["x-order-code"] || "SIN-CODIGO";

// 🧾 mensaje para WhatsApp
const message = `
Hola 👋, acabo de realizar un pedido en *Piko Kopi* ☕🛒

🧾 Código de orden: *${orderCode}*
👤 Nombre: *${customer.name}*
📍 Ciudad / Dirección: *${customer.address || "No especificado"}*
💰 Total: *Bs ${total}*

Quedo atento(a), gracias 🙌
`;

// 📲 abrir WhatsApp
const phoneNumber = "59164723077"; // 🔴 TU NÚMERO AQUÍ
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

window.open(whatsappUrl, "_blank");


      /* ===== DESCARGAR COMPROBANTE PDF ===== */
      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "comprobante-piko-kopi.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("✅ Pedido enviado correctamente");

    clearCart();

setCustomer({
  name: "",
  phone: "",
  email: "",
  address: "",
});

// ⏱️ pequeña pausa para UX y redirigir
setTimeout(() => {
  navigate("/");
}, 1000);

    } catch (error) {
      console.error("❌ Error checkout:", error);

      alert(
        error?.response?.data?.message ||
        "❌ Error al enviar el pedido"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-lg">
        🛒 Tu carrito está vacío
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>

      {cart.map((item) => (
        <div
          key={item.key}
          className="flex flex-col sm:flex-row gap-4 items-center border-b py-4"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1 w-full">
            <p className="font-semibold">{item.name}</p>

            {item.variant && (
              <p className="text-sm text-gray-500">
                {item.variant.name}: {item.variant.value}
              </p>
            )}

            {/* CONTROLES DE CANTIDAD */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => decreaseQty(item.key)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={loading}
              >
                −
              </button>

              <span className="px-3">{item.quantity}</span>

              <button
                onClick={() => increaseQty(item.key)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={loading}
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold">
              Bs {item.price * item.quantity}
            </p>

            <button
              onClick={() => removeFromCart(item.key)}
              className="text-red-600 text-sm hover:underline mt-1"
              disabled={loading}
            >
              Quitar
            </button>
          </div>
        </div>
      ))}

      {/* ===== FORMULARIO CLIENTE ===== */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre completo *"
          value={customer.name}
          onChange={(e) =>
            setCustomer({ ...customer, name: e.target.value })
          }
          className="border px-3 py-2 rounded"
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Teléfono / WhatsApp *"
          value={customer.phone}
          onChange={(e) =>
            setCustomer({ ...customer, phone: e.target.value })
          }
          className="border px-3 py-2 rounded"
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email (opcional)"
          value={customer.email}
          onChange={(e) =>
            setCustomer({ ...customer, email: e.target.value })
          }
          className="border px-3 py-2 rounded col-span-1 sm:col-span-2"
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Dirección / Ciudad (opcional)"
          value={customer.address}
          onChange={(e) =>
            setCustomer({ ...customer, address: e.target.value })
          }
          className="border px-3 py-2 rounded col-span-1 sm:col-span-2"
          disabled={loading}
        />
      </div>

      {/* ===== TOTAL Y BOTÓN ===== */}
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">
          Total: Bs {total}
        </p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </div>
    </div>
  );
}
