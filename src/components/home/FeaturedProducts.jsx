import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../bouquets/common/ProductCard";
import axios from "axios";

const FeaturedProducts = ({ favorites, toggleFavorite }) => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section className="py-16 px-4  text-white bg-slate-950 ">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}     
        className="text-3xl font-bold text-center mb-12 text-red-600"
      >
        Featured Products
      </motion.h2>

      <div className="grid  grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:grid-cols-4">
        {products
          .filter((product) => product.featured) // show only featured
          .map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isFavorite={Array.isArray(favorites) && favorites.includes(product._id)}
              onToggleFavorite={() => toggleFavorite(product._id)}
            />
          ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
