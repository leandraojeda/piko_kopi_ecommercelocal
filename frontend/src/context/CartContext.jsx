import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Añadir al carrito
  const addToCart = (product, quantity = 1, variant = null) => {
    const key = variant
      ? `${product.id}-${variant.id}`
      : `${product.id}`;

    const existing = cart.find((item) => item.key === key);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          key,
          productId: product.id,
          name: product.name,
          price: variant?.price || product.basePrice,
          variant,
          quantity,
          image: product.ProductImages?.[0]?.imageUrl,
        },
      ]);
    }
  };

  // Quitar producto completamente
  const removeFromCart = (key) => {
    setCart(cart.filter((item) => item.key !== key));
  };

  // Aumentar cantidad
  const increaseQty = (key) => {
    setCart(
      cart.map((item) =>
        item.key === key
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Disminuir cantidad (si llega a 0, se elimina)
  const decreaseQty = (key) => {
    setCart(
      cart
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  // Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
