import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${process.env.VITE_API_BASE_URL}/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-gray-300 text-lg">
        Loading blog details...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 text-lg">
        {error}
        <Link
          to="/blog"
          className="mt-4 text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
          <Link
            to="/blog"
            className="text-red-500 hover:underline font-medium"
          >
            Return to Blog
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#141414] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.article
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#111111] border border-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative w-full h-[420px]">
            <img
              src={blog?.image || "/default-blog.jpg"}
              alt={blog?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Floating category badge */}
            <div className="absolute bottom-6 left-6 bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md uppercase tracking-wide">
              {blog?.category || "Automotive"}
            </div>
          </div>

          {/* Blog Content */}
          <div className="p-8 md:p-10 text-gray-200">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center text-sm text-gray-400 mb-5">
              <span className="flex items-center gap-1">
                <i className="ri-calendar-line text-red-500"></i>
                {blog?.date || "Recently Updated"}
              </span>
              <span className="mx-3">•</span>
              <span className="flex items-center gap-1">
                <i className="ri-user-3-line text-red-500"></i>
                {blog?.author || "AutoMods Team"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-snug">
              {blog?.title}
            </h1>

            {/* Content */}
            <motion.div
              className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              dangerouslySetInnerHTML={{
                __html:
                  blog?.content ||
                  `<p>No content available for this blog.</p>`,
              }}
            />

            {/* Divider */}
            <div className="my-10 border-t border-gray-800"></div>

            {/* Back Button */}
            <div className="text-center">
              <Link
                to="/blog"
                className="inline-block text-red-500 hover:text-red-400 bg-red-500/10 border border-red-600/30 rounded-full px-6 py-2 font-medium transition-all hover:bg-red-600/20"
              >
                ← Back to All Blogs
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail;
