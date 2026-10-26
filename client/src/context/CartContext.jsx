import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('grocery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('grocery_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return false;
    }

    let success = true;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product === product._id);

      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQty = existing.quantity + quantity;

        if (newQty > product.stock) {
          showToast(`Only ${product.stock} ${product.unit} available in stock.`, 'error');
          success = false;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          stock: product.stock
        };
        showToast(`Updated ${product.name} quantity to ${newQty}`, 'success');
        return updated;
      } else {
        if (quantity > product.stock) {
          showToast(`Only ${product.stock} ${product.unit} available in stock.`, 'error');
          success = false;
          return prevItems;
        }

        const effectivePrice =
          product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price
            ? product.discountPrice
            : product.price;

        const newItem = {
          product: product._id,
          name: product.name,
          price: effectivePrice,
          originalPrice: product.price,
          discountPrice: product.discountPrice,
          unit: product.unit,
          image: product.image,
          stock: product.stock,
          quantity
        };

        showToast(`Added ${product.name} to cart`, 'success');
        return [...prevItems, newItem];
      }
    });

    return success;
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product === productId) {
          if (quantity > item.stock) {
            showToast(`Max available stock is ${item.stock}`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => {
      const target = prevItems.find((i) => i.product === productId);
      if (target) {
        showToast(`Removed ${target.name} from cart`, 'info');
      }
      return prevItems.filter((i) => i.product !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 30;
  const totalAmount = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
