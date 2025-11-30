import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/authContext";
import axios from "axios";

const ProductView = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token } = useAuth();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ author: "", rating: 0, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct({
          ...data,
          reviews: data.reviews || [],
          images: data.images?.length ? data.images : [data.image],
        });
        setRelatedProducts(data.relatedProducts || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleQuantityChange = (value) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!token) {
      navigate("/register");
      return;
    }
    if (!product || !product._id) return;
    addToCart({ productId: product._id, quantity });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      await axios.post(
        `/api/products/${product._id}/reviews`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct({
        ...product,
        reviews: [...product.reviews, newReview],
      });
      setNewReview({ author: "", rating: 0, comment: "" });
      setReviewSubmitted(true);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) return <div className="p-8 text-gray-300">Loading...</div>;
  if (!product) return <div className="p-8 text-red-500">Product not found.</div>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-gray-400">
          <Link to="/" className="hover:text-red-500 transition">Home</Link>
          <span className="mx-2 text-gray-500">›</span>
          <Link to="/products" className="hover:text-red-500 transition">Products</Link>
          <span className="mx-2 text-gray-500">›</span>
          <span className="text-gray-200">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Images */}
            <div className="p-6">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300"
              />
              {product.images?.length > 1 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`rounded-md overflow-hidden border ${
                        selectedImage === idx
                          ? "border-red-500 ring-2 ring-red-500"
                          : "border-slate-700"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx}`}
                        className="w-full h-20 object-cover hover:opacity-80"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              <h1 className="text-3xl font-bold mb-3 text-white">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill={
                        star <= Math.round(calculateAverageRating(product.reviews))
                          ? "currentColor"
                          : "none"
                      }
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-400 text-sm">
                  {calculateAverageRating(product.reviews)} ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

              <div className="text-3xl font-semibold text-red-500 mb-8">
                PKR {product.price?.toFixed(2)}
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="mr-4 text-slate-200">Quantity:</span>
                  <div className="flex items-center border border-slate-700 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-1 text-gray-300 hover:text-white"
                    >
                      −
                    </button>
                    <span className="px-4 text-gray-200">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-1 text-gray-300 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all py-3 rounded-xl text-white font-semibold shadow-lg shadow-red-900/20"
                >
                  Add to Cart
                </button>
              </div>

              <div className="border-t border-slate-700 pt-5 mt-auto text-sm text-gray-400 space-y-2">
                <div>✓ Free delivery on orders over PKR 100</div>
                <div>✓ Same-day delivery before 2 PM</div>
                <div>✓ Satisfaction guaranteed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Customer Reviews</h2>

          {product.reviews?.length > 0 ? (
            <div className="space-y-4 mb-8">
              {product.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="border border-slate-700 bg-slate-800/60 rounded-xl p-4 hover:border-red-600 transition"
                >
                  <div className="font-semibold text-red-400">{review.author}</div>
                  <div className="text-yellow-400">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="text-gray-300 mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mb-6">No reviews yet. Be the first to share your thoughts!</p>
          )}

          {/* Review Form */}
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-red-500">Leave a Review</h3>
            <input
              type="text"
              required
              placeholder="Your Name"
              className="border border-slate-700 rounded-lg p-2 w-full bg-slate-800 text-gray-200 focus:ring-2 focus:ring-red-600 outline-none"
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
            />
            <select
              required
              className="border border-slate-700 rounded-lg p-2 w-full bg-slate-800 text-gray-200 focus:ring-2 focus:ring-red-600 outline-none"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            >
              <option value={0}>Select Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && "s"}
                </option>
              ))}
            </select>
            <textarea
              required
              placeholder="Your comment..."
              className="border border-slate-700 rounded-lg p-2 w-full bg-slate-800 text-gray-200 focus:ring-2 focus:ring-red-600 outline-none"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 transition-all px-6 py-2 rounded-lg text-white font-medium shadow-md shadow-red-900/30"
            >
              Submit Review
            </button>
            {reviewSubmitted && (
              <p className="text-green-500 font-medium">Thank you for your review!</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
