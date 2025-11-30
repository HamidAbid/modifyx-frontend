import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useCart } from '../../context/cartContext';
import { useAuth } from '../../context/authContext';


const WishlistSection = ({ wishlist, onRemove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { token } = useAuth();

  const filteredItems = wishlist.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower) ||
      (item.price && item.price.toString().includes(searchTerm))
    );
  });

  function handleAddToCart(item) {
    console.log(token,item);
    if (!token) {
      navigate("/register");
      return;
    }
  
    if (!item || !item._id) {
      console.warn("Invalid product data");
      return;
    }
  
    // ✅ Pass an object, not individual args
    addToCart({ productId: item._id, quantity:1 });
    setTimeout(() => {
      onRemove(item._id)
    }, 800);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search wishlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 p-2 pl-10  rounded focus:outline-none border-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-8 bg-gray-800 rounded-lg">
          <p className="text-gray-300">Your wishlist is empty.</p>
          <Link to="/products" className="mt-2 inline-block text-primary hover:underline">
            Browse Products
          </Link>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-800 rounded-lg">
          <p className="text-gray-500">No items match your search.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-2 text-primary hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item._id} className=" bg-black/50 border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image || '/img/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <Link to={`/product/${item._id}`} className="hover:text-primary">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                </Link>

                <p className="text-gray-600 mb-2">{item.category}</p>
                <p className="font-bold text-lg mb-3">${item.price?.toFixed(2)}</p>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center text-sm btn rounded-md text-white px-3 py-1 "
                  >
                    <FaShoppingCart className="mr-1" /> Add to Cart
                  </button>

                  <button
                    onClick={() => onRemove(item._id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistSection;
