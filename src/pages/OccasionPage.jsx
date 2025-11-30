import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const occasionTitles = {
  birthday: 'Birthday Flowers & Gifts',
  anniversary: 'Anniversary Flowers & Gifts',
  wedding: 'Wedding Flowers & Decorations',
  sympathy: 'Sympathy Flowers & Arrangements'
};

const occasionDescriptions = {
  birthday: 'Find the perfect flowers and gifts to celebrate birthdays',
  anniversary: 'Romantic arrangements to celebrate your special milestone',
  wedding: 'Beautiful floral arrangements for your wedding day',
  sympathy: 'Thoughtful arrangements to express your condolences'
};

const OccasionPage = () => {
  const { occasion } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.get('/api/products')
      .then(response => {
        
        // Assuming each product has an 'occasion' field
        const filteredProducts = response.data.products.filter(product =>
          product.occasion.includes(occasion)
        );
        
        setProducts(filteredProducts);
       
        setLoading(false);
      })
      .catch(err => {
        console.error('Axios error:', err);
        setError(err.message || 'Failed to load products');
        setLoading(false);
      });
  }, [occasion]);

  if (!occasion || !occasionTitles[occasion]) {
    return (
      <div className="min-h-screen bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Occasion not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900">{occasionTitles[occasion]}</h1>
          <p className="mt-4 text-lg text-gray-600">{occasionDescriptions[occasion]}</p>
        </motion.div>

        {products.length === 0 ? (
          <p className="text-center text-gray-700">No products found for this occasion.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">PKR {product.price.toFixed(2)}</span>
                    <Link to={`/product/${product._id}`} className="btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OccasionPage;
