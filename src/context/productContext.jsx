// src/context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Helper for Axios with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ✅ Get Wishlist
  const fetchWishlist = async () => {
    try {
      setLoadingWishlist(true);
      const { data } = await axios.get(`${API_BASE}/api/users/wishlist`, getAuthHeaders());
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoadingWishlist(false);
    }
  };

  // ✅ Add to Wishlist
  const addToWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/users/wishlist`,
        { productId, action: "add" },
        getAuthHeaders()
      );
      setWishlist(data);
      toast.success("Added to wishlist 💖");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add item");
    }
  };

  // ✅ Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/users/wishlist`,
        { productId, action: "remove" },
        getAuthHeaders()
      );
      setWishlist(data);
      toast.info("Removed from wishlist 💔");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item");
    }
  };

  // ✅ Check if Product is in Wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  // ✅ Load wishlist when user logs in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchWishlist();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        wishlist,
        loadingWishlist,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};
