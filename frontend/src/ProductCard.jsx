import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const image = product.ProductImages?.[0]?.imageUrl;
  const hasVariants = product.hasVariants;
  const variants = product.ProductVariants || [];

const { addToCart } = useCart();

const handleAdd = (e) => {
  e.preventDefault();
  addToCart(product, 1);
};

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 relative">
      {/* IMAGEN */}
      <Link to={`/products/${product.id}`}>
        <img
          src={image}
          alt={product.name}
          className="h-40 w-full object-cover mb-4 rounded"
        />
      </Link>

      {/* NOMBRE */}
      <Link to={`/products/${product.id}`}>
        <h3 className="font-semibold hover:underline">{product.name}</h3>
      </Link>

      {/* PRECIO */}
      <p className="mt-1 text-green-600 font-bold">
        Bs {product.basePrice}
      </p>

      {/* VARIANTES */}
      {hasVariants && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">
            Variantes disponibles
          </p>

          <div className="flex gap-1 flex-wrap">
            {variants.slice(0, 4).map((v) => (
              <div
                key={v.id}
                title={v.value}
                className="w-5 h-5 rounded-full border"
                style={{
                  backgroundColor: v.value.toLowerCase().includes("rojo")
                    ? "red"
                    : v.value.toLowerCase().includes("azul")
                    ? "blue"
                    : "#ddd",
                }}
              />
            ))}

            {variants.length > 4 && (
              <span className="text-xs text-gray-500">+{variants.length - 4}</span>
            )}
          </div>
        </div>
      )}

      {/* BOTÓN */}
      <div className="mt-4">
        {hasVariants ? (
          <Link
            to={`/products/${product.id}`}
            className="block text-center text-sm bg-gray-200 hover:bg-gray-300 py-2 rounded"
          >
            Ver opciones
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold"
          >
            + Añadir
          </button>
        )}
      </div>
    </div>
  );
}
