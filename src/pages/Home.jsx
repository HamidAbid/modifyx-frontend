import React from "react";

// Components
import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Testimonials from "../components/home/Testimonials";

// Data
import { occasions, testimonials } from "../utils/sampleData";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <FeaturedProducts />
      <Testimonials testimonials={testimonials} />
    </div>
  );
};

export default Home;
