import { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// Sample bouquet recommendations (same as in QuickQuiz.jsx)
const bouquetRecommendations = {
  romantic: [
    {
      id: 101,
      name: "Love",
      description:
        "A classic arrangement of red roses with eucalyptus, perfect for expressing deep love.",
      price: 69.99,
      image: "http://localhost:3000/img/love.WEBP",
      details: {
        flowers: ["Red Roses", "Eucalyptus"],
        size: "Medium",
        care: "Change water every 2-3 days, trim stems at an angle",
        occasion: "Romance, Anniversary, Valentine's Day",
        delivery: "Same day delivery available",
      },
    },
    {
      id: 102,
      name: "Sweet Whispers",
      description:
        "red and white roses with baby's breath, expressing tender feelings.",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=1372&auto=format&fit=crop",
      details: {
        flowers: ["red Roses", "White Roses", "Baby's Breath"],
        size: "Medium",
        care: "Change water every 2-3 days, keep away from direct sunlight",
        occasion: "Romance, Anniversary, First Date",
        delivery: "Same day delivery available",
      },
    },
  ],
  congratulations: [
    {
      id: 201,
      name: "Celebration",
      description:
        "A vibrant mix of sunflowers, gerbera daisies and chrysanthemums to celebrate success.",
      price: 49.99,
      image: "http://localhost:3000/img/celebration.WEBP",
      details: {
        flowers: ["Sunflowers", "Gerbera Daisies", "Chrysanthemums"],
        size: "Large",
        care: "Change water every 2-3 days, trim stems regularly",
        occasion: "Graduation, Promotion, Achievement",
        delivery: "Same day delivery available",
      },
    },
    {
      id: 202,
      name: "New Beginnings",
      description:
        "A cheerful arrangement of yellow tulips and white lilies to mark a new chapter.",
      price: 54.99,
      image:
        "https://images.unsplash.com/photo-1531637078800-a52de262330f?q=80&w=1471&auto=format&fit=crop",
      details: {
        flowers: ["Yellow Tulips", "White Lilies"],
        size: "Medium",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "New Job, New Home, Fresh Start",
        delivery: "Same day delivery available",
      },
    },
  ],
  sympathy: [
    {
      id: 301,
      name: "Peaceful Thoughts",
      description:
        "An elegant arrangement of white lilies and roses expressing sympathy and respect.",
      price: 64.99,
      image:
        "https://images.unsplash.com/photo-1591710668263-bee1e9db2a26?q=80&w=1374&auto=format&fit=crop",
      details: {
        flowers: ["White Lilies", "White Roses"],
        size: "Large",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "Sympathy, Condolences, Memorial",
        delivery: "Same day delivery available",
      },
    },
    {
      id: 302,
      name: "Gentle Embrace",
      description:
        "Soft pastel flowers conveying comfort and remembrance during difficult times.",
      price: 59.99,
      image: "http://localhost:3000/img/gentle.WEBP",
      details: {
        flowers: ["red Roses", "White Carnations", "Baby's Breath"],
        size: "Medium",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "Sympathy, Condolences, Memorial",
        delivery: "Same day delivery available",
      },
    },
  ],
  birthday: [
    {
      id: 401,
      name: "Birthday Bash",
      description:
        "A vibrant, colorful arrangement to make their special day even brighter.",
      price: 49.99,
      image: "http://localhost:3000/img/birthday.WEBP",
      details: {
        flowers: ["Mixed Roses", "Gerbera Daisies", "Carnations"],
        size: "Large",
        care: "Change water every 2-3 days, trim stems regularly",
        occasion: "Birthday, Celebration",
        delivery: "Same day delivery available",
      },
    },
    {
      id: 402,
      name: "Another Year Wiser",
      description:
        "An elegant mixture of premium blooms to celebrate another year of life.",
      price: 59.99,
      image: "http://localhost:3000/img/year.AVIF",
      details: {
        flowers: ["Premium Roses", "Orchids", "Lilies"],
        size: "Large",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "Birthday, Milestone Celebration",
        delivery: "Same day delivery available",
      },
    },
  ],
  thankYou: [
    {
      id: 501,
      name: "Grateful Heart",
      description:
        "Express your gratitude with this thoughtful arrangement of peach roses and white lilies.",
      price: 44.99,
      image:
        "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=1374&auto=format&fit=crop",
      details: {
        flowers: ["Peach Roses", "White Lilies"],
        size: "Medium",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "Thank You, Appreciation",
        delivery: "Same day delivery available",
      },
    },
    {
      id: 502,
      name: "Appreciation",
      description:
        "A harmonious blend of purple and white flowers to show how much you care.",
      price: 49.99,
      image: "http://localhost:3000/img/apprecation.WEBP",
      details: {
        flowers: ["Purple Roses", "White Lilies", "Purple Statice"],
        size: "Medium",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "Thank You, Appreciation",
        delivery: "Same day delivery available",
      },
    },
  ],
  getWell: [
    {
      id: 601,
      name: "Sunshine Remedy",
      description:
        "Bright yellow and orange flowers to lift spirits and speed recovery.",
      price: 45.99,
      image: "http://localhost:3000/img/sunshine.WEBP",
      details: {
        flowers: ["Yellow Roses", "Orange Gerbera Daisies"],
        size: "Medium",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "Get Well, Recovery",
        delivery: "Same day delivery available",
      },
    },
    {
      id: 602,
      name: "Healing Thoughts",
      description:
        "A soothing arrangement of soft colors to bring comfort during recuperation.",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1518709911915-712d5fd04677?q=80&w=1376&auto=format&fit=crop",
      details: {
        flowers: ["red Roses", "White Lilies", "Baby's Breath"],
        size: "Medium",
        care: "Change water every 2-3 days, keep in cool place",
        occasion: "Get Well, Recovery",
        delivery: "Same day delivery available",
      },
    },
  ],
};

const QuizProductDetail = () => {
  const { id } = useParams();
  const { cartItems, setCartItems } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  // Find the product in all categories
  let product = null;
  for (const category of Object.values(bouquetRecommendations)) {
    const found = category.find((item) => item.id === parseInt(id));
    if (found) {
      product = found;
      break;
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/quiz" className="btn-primary">
            Back to Quiz
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    };

    setCartItems([...cartItems, itemToAdd]);
    toast.success(`${product.name} added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2 text-gray-500">›</span>
          <Link to="/quiz" className="text-gray-500 hover:text-gray-700">
            Quiz
          </Link>
          <span className="mx-2 text-gray-500">›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Overview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="p-6">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="text-2xl font-bold text-gray-900 mb-6">
                PKR {product.price.toFixed(2)}
              </div>

              {/* Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="mr-4 text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-600">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary py-2"
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Flowers Included
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {product.details.flowers.join(", ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Size</h3>
                    <p className="mt-1 text-gray-900">{product.details.size}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Care Instructions
                    </h3>
                    <p className="mt-1 text-gray-900">{product.details.care}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Perfect For
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {product.details.occasion}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Delivery
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {product.details.delivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizProductDetail;
