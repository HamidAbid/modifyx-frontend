import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import homeHero from "../../../img/cars/hero-bg.jpg";
const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-[600px] bg-cover bg-black bg-center"
      style={{ backgroundImage: `url(${homeHero})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-white"
        >
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Our Modify
          </h1>
          <p className="text-xl mb-8 ">
           Your car. Your style. Your identity. <br />
Stand out with every drive.
          </p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
            >
              Shop Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
