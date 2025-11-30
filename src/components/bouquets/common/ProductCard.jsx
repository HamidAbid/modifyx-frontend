import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProduct } from "../../../context/productContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useProduct();
  const favorite = isInWishlist(product._id);

  const toggleFavorite = () => {
    if (favorite) removeFromWishlist(product._id);
    else addToWishlist(product._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-800 hover:border-red-600 transition-all duration-300"
    >
      {/* Image Section */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="relative h-64 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="object-cover  w-full h-full transition-transform duration-500 hover:scale-110"
        />

        {/* Favorite Heart Button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 p-2.5 rounded-full shadow-md backdrop-blur-sm border border-white/10 z-50 hover:cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {favorite ? (
              <motion.div
                key="filled"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaHeart className="w-5 h-5 text-red-500 drop-shadow-glow" />
              </motion.div>
            ) : (
              <motion.div
                key="outline"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaRegHeart className="w-5 h-5 text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Red glow overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </motion.div>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-1 tracking-wide">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4">PKR {product.price.toFixed(2)}</p>

        <div className="mt-auto">
          <Link to={`/product/${product._id}`} className="block">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 5px 0.8px #ffffff" }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold tracking-wide transition-all duration-300"
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
