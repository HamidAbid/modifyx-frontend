import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);   // Optional: Clear cart if no user is logged in
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get('/api/cart/getItems', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const addToCart = async ({ productId, customData, quantity }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Login first');
        return;
      }

      const payload = { quantity };

      if (productId) {
        payload.productId = productId;
        payload.itemType = 'standard';
      } else if (customData) {
        payload.customData = customData;
        payload.itemType = 'custom';
      } else {
        throw new Error('Must provide productId or customData.');
      }

      await axios.post('/api/cart/add', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Item Added to Cart')

      await fetchCart();
     
    } catch (err) {
      console.error('Failed to add to cart:', err.response?.data || err.message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      
      const token = localStorage.getItem('token');
      await axios.delete(`/api/cart/remove/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err?.response?.data || err.message);
    }
  };
  
  useEffect(() => {
    fetchCart();
  }, []);

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      await axios.delete('/api/cart/clear', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      await fetchCart();
      toast.success('Cart cleared!');
    } catch (err) {
      console.error('Failed to clear cart:', err?.response?.data || err.message);
    }
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        fetchCart,
        removeFromCart,
        loading,
        clearCart
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
