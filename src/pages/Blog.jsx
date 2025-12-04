import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// 🧩 Car-related categories
const categories = [
  "All Categories",
  "Performance",
  "Detailing",
  "Exterior",
  "Wheels & Tires",
  "Interior",

];

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch blogs from backend
  useEffect(() => {
    axios
      .get("/api/blogs")
      .then((res) => {
        setBlogPosts(res.data);
      })
      .catch((error) => {
        console.error("Error while fetching blogs:", error);
      });
  }, []);

  // ✅ Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const category = post.category?.toLowerCase().trim() || "";
    const matchesCategory =
      selectedCategory === "All Categories" ||
      category === selectedCategory.toLowerCase().trim() ||
      category.includes(selectedCategory.toLowerCase().trim());

    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#141414] text-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-red-500 tracking-wide uppercase">
            AutoMods Blog
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Explore the latest car modification tips, performance upgrades, and styling trends.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl shadow-lg sm:p-6 p-2  mb-10">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:w-96 h-11">
              <input
                type="text"
                placeholder="Search car articles..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#0d0d0d] text-gray-200 border border-gray-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Category Buttons */}
            <div className="flex overflow-x-auto flex-wrap  hide-scrollbar gap-1 sm:gap-3 pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-red-600 text-white shadow-md shadow-red-700/30"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post._id || index}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-[#111111] border border-gray-800 hover:border-red-600 transition-all rounded-xl overflow-hidden shadow-lg hover:shadow-red-600/10"
                >
                  <div className="overflow-hidden">
                    <img
                      src={post.image || "/default-blog.jpg"}
                      alt={post.title}
                      className="w-full h-52 object-cover transform transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-red-500 mb-2">
                      <span>{post.author || "AutoMods Team"}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-100 mb-2 hover:text-red-500 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt || "Read our latest insights and trends in car modifications."}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                        {post.category || "General"}
                      </span>
                      <Link
                        to={`/blog/${post._id}`}
                        className="text-red-500 hover:text-red-400 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-gray-600 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-red-500 mb-2">
                No car blogs found
              </h3>
              <p className="text-gray-500">
                Try changing your search or category to explore more content.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blog;
