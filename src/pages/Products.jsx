import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";

const categories = [
  { id: "all", name: "All Products" },
  { id: "interior", name: "Interior" },
  { id: "exterior", name: "Exterior" },
];

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(category || "all");
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { token } = useAuth();

  // Reset pagination when category or sort changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setVisibleProducts([]);
    setHasMore(true);
  }, [activeCategory, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [page, activeCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const params = {
        category: activeCategory !== "all" ? activeCategory : undefined,
        sort: sortBy,
      };

      const response = await axios.get("/api/products", { params });
      const fetchedProducts = response.data.products;
      console.log(response.data);

      setProducts(fetchedProducts);
      setIsLoaded(false);
      setVisibleProducts([]);
      setTimeout(() => setIsLoaded(true), 100);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && products.length > 0) {
      const showProducts = async () => {
        setVisibleProducts([]);
        for (let i = 0; i < products.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          setVisibleProducts((prev) => [...prev, products[i]._id]);
        }
      };
      showProducts();
    }
  }, [isLoaded, products]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/users/userwishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data); // Array of productIds
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token]);

  const toggleFavorite = async (productId) => {
    const isFavorited = favorites.includes(productId);
    const updatedFavorites = isFavorited
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(updatedFavorites);

    try {
      await axios.post(
        "/api/users/wishlist",
        { productId, action: isFavorited ? "remove" : "add" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.log("Error while updating favorites:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId === activeCategory) return;
    setActiveCategory(categoryId);
    navigate(categoryId === "all" ? "/products" : `/products/${categoryId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className="bg-slate-950 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 slide-up text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-red-600 tracking-wide">
            {activeCategory === "all"
              ? "All Products"
              : categories.find((cat) => cat.id === activeCategory)?.name ||
                "Products"}
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            Explore our high-performance car modification accessories and parts
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-slate-400 mt-3 rounded-full mx-auto md:mx-0"></div>
        </div>

        {/* Category Buttons + Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 slide-up">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-red-600 to-slate-600 text-white shadow-[0_0_10px_0.9px_rgba(255,0,0,0.5)]"
                    : "bg-slate-900 text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center slide-in-right">
            <label
              htmlFor="sort"
              className="text-sm font-medium text-slate-300 mr-2"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="text-white bg-slate-900 rounded-md text-sm p-2 border border-slate-700 focus:ring-2 focus:ring-red-600"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {products.map((product) => (
            <div
              key={product._id}
              className={`bg-slate-900 rounded-xl shadow-md overflow-hidden transition-all duration-500 transform hover:-translate-y-1 hover:shadow-[0_0_10px_1px_rgba(255,0,0,0.3)] flex flex-col justify-between ${
                visibleProducts.includes(product._id) ? "fade-in" : "opacity-0"
              }`}
            >
              <div className="h-64 overflow-hidden relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-red-600 ${
                        favorites.includes(product._id)
                          ? "scale-125 drop-shadow-[0_0_6px_rgba(255,0,0,0.7)]"
                          : ""
                      }`}
                      fill={
                        favorites.includes(product._id)
                          ? "currentColor"
                          : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-red-600/80 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-col items-start justify-between">
                  <h3 className="text-lg font-semibold text-white transition-colors duration-300 hover:text-red-500">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-lg font-bold text-slate-400">
                    PKR {product.price.toFixed(2)}
                  </p>
                </div>
                <p className="mt-2 text-slate-300 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-5">
                  <Link to={`/product/${product._id}`}>
                    <button className="w-full py-2.5 bg-gradient-to-r from-red-600 to-slate-700 hover:from-red-700 hover:to-slate-600 text-white font-semibold rounded-md shadow-md hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition-all duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products */}
        {products.length === 0 && (
          <div className="text-center py-16 fade-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-red-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              No products found
            </h3>
            <p className="text-slate-400">
              Try selecting a different category or check back later.
            </p>
          </div>
        )}

        {/* Scroll to Top Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-3 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,0,0.6)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
