import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiPublic from "../api/apiPublic";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    apiPublic
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        const first =
          res.data?.ProductImages?.[0]?.imageUrl || "";
        setSelectedImage(first);
      })
      .catch(() => alert("Error al cargar producto"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Cargando…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center">
        Producto no encontrado
      </div>
    );
  }

  const images = product.ProductImages || [];

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.basePrice);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    if (product.hasVariants && !selectedVariant) {
      alert("Seleccione una variante");
      return;
    }
    addToCart(product, qty, selectedVariant);
    alert("Producto añadido al carrito");
  };

  return (
    <div className="bg-pink-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-5 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ================= GALERÍA ================= */}
          <div>
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl border"
            />

            <div className="flex gap-3 mt-4 overflow-x-auto hide-scrollbar">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`rounded-lg p-1 border transition
                    ${
                      selectedImage === img.imageUrl
                        ? "border-pink-600 ring-2 ring-pink-200"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                >
                  <img
                    src={img.imageUrl}
                    alt="thumb"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= INFO ================= */}
          <div>
            {/* TÍTULO */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {product.name}
            </h1>

            {/* ================= CATEGORÍAS ================= */}
            {product.Categories?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.Categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="
                      inline-flex items-center gap-2
                      bg-pink-100 text-pink-700
                      px-3 py-1
                      rounded-full text-xs font-medium
                      hover:bg-pink-200 transition
                    "
                  >
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* DESCRIPCIÓN */}
            <p className="text-gray-600 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* ================= PRECIO ================= */}
            <div className="mt-6">
              <p className="text-3xl font-bold text-pink-600">
                Bs {price}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Stock:{" "}
                {product.hasVariants
                  ? selectedVariant
                    ? selectedVariant.stock
                    : "Seleccione una variante"
                  : product.stock}
              </p>
            </div>

            {/* ================= VARIANTES ================= */}
            {product.hasVariants &&
              product.ProductVariants?.length > 0 && (
                <div className="mt-6">
                  <p className="font-semibold text-gray-700 mb-2">
                    {product.ProductVariants[0]?.name}
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    {product.ProductVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition
                          ${
                            selectedVariant?.id === variant.id
                              ? "ring-2 ring-pink-500 border-pink-500"
                              : "border-gray-300 hover:border-pink-400"
                          }`}
                      >
                        {variant.displayType === "color" && (
                          <span
                            className="w-6 h-6 rounded-full"
                            style={{
                              backgroundColor:
                                variant.displayValue,
                            }}
                          />
                        )}

                        {variant.displayType === "image" && (
                          <img
                            src={variant.displayValue}
                            alt={variant.value}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}

                        {variant.displayType === "text" && (
                          <span className="text-xs font-medium">
                            {variant.value}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedVariant && (
                    <p className="text-sm text-gray-500 mt-2">
                      Stock disponible:{" "}
                      {selectedVariant.stock}
                    </p>
                  )}
                </div>
              )}

            {/* ================= CANTIDAD ================= */}
            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm text-gray-700">
                Cantidad:
              </span>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="px-4 py-2 hover:bg-pink-50"
                  onClick={() =>
                    setQty((q) => Math.max(1, q - 1))
                  }
                >
                  −
                </button>
                <span className="px-4 font-medium">
                  {qty}
                </span>
                <button
                  className="px-4 py-2 hover:bg-pink-50"
                  onClick={() =>
                    setQty((q) => q + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* ================= BOTONES ================= */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Añadir al carrito
              </button>

              <button
                onClick={handleAddToCart}
                className="bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-semibold transition"
              >
                Comprar ahora
              </button>
            </div>

            <div className="mt-5 text-sm text-gray-500 leading-relaxed">
              ✔ Envío a coordinar por WhatsApp <br />
              ✔ Pago contra entrega o transferencia
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
