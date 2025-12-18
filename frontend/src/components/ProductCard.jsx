import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const image =
    product.ProductImages?.[0]?.imageUrl ||
    "https://via.placeholder.com/300x300?text=Producto";

  const price = Number(product.basePrice);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;

  const variants = product.ProductVariants || [];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden relative">

      {/* ================= BADGES ================= */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {product.isOffer && (
          <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
            Oferta
          </span>
        )}
        {product.isNew && (
          <span className="bg-pink-400 text-white text-xs px-2 py-1 rounded-full">
            Nuevo
          </span>
        )}
        {product.isPack && (
          <span className="bg-pink-700 text-white text-xs px-2 py-1 rounded-full">
            Pack
          </span>
        )}
      </div>

      {/* ================= IMAGEN ================= */}
      <Link to={`/products/${product.id}`}>
        <img
          src={image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* ================= INFO ================= */}
      <div className="p-4">

        <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* ===== PRECIO ===== */}
        <div className="mb-2">
          {oldPrice && (
            <span className="text-xs line-through text-gray-400 mr-2">
              Bs {oldPrice}
            </span>
          )}
          <span className="text-pink-600 font-bold text-lg">
            Bs {price}
          </span>
        </div>

        {/* ===== VARIANTES VISUALES ===== */}
        {product.hasVariants && variants.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {variants.slice(0, 5).map((v) => (
              <span
                key={v.id}
                title={v.value}
                className="w-4 h-4 rounded-full border border-pink-300"
                style={{
                  backgroundColor: v.color || "#fbcfe8"
                }}
              />
            ))}
            {variants.length > 5 && (
              <span className="text-xs text-gray-500 ml-1">
                +{variants.length - 5}
              </span>
            )}
          </div>
        )}

        {/* ===== TEXTO VARIANTES ===== */}
        {product.hasVariants && (
          <p className="text-xs text-gray-500 mb-3">
            Variantes disponibles
          </p>
        )}

        {/* ================= BOTONES ================= */}
        <div className="flex gap-2">
          {!product.hasVariants && (
            <button
              onClick={() => addToCart(product, 1)}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Añadir
            </button>
          )}

          <Link
            to={`/products/${product.id}`}
            className="flex-1 border border-pink-300 hover:bg-pink-50 text-pink-600 text-center py-2 rounded-lg text-sm font-medium transition"
          >
            Ver
          </Link>
        </div>

      </div>
    </div>
  );
}
