// Modern & Sleek Cart.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import CartSummary from "../components/cart/CartSummary";

const Cart = () => {
  const {
    cartItems,
    setCartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  } = useCart();

  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart().catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item, index) => {
      const id =
        item.itemType === "custom" ? `custom-${index}` : item.product?._id;
      acc[id] = item.quantity;
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, [cartItems]);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item, index) => {
      const id =
        item.itemType === "custom" ? `custom-${index}` : item.product?._id;
      const price =
        item.itemType === "custom"
          ? item.customData?.price || 0
          : item.product?.price || 0;
      return total + price * (quantities[id] || 1);
    }, 0);

  const calculateShipping = () => (calculateSubtotal() > 100 ? 0 : 10.99);
  const calculateTax = () => calculateSubtotal() * 0.07;
  const calculateTotal = () =>
    calculateSubtotal() + calculateShipping() + calculateTax();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities({ ...quantities, [productId]: newQuantity });
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    const newQuantities = { ...quantities };
    delete newQuantities[itemId];
    setQuantities(newQuantities);
    setCartItems((prevItems) =>
      prevItems.filter((item, index) => {
        const id =
          item.itemType === "custom" ? `custom-${index}` : item.product?._id;
        return id !== itemId;
      })
    );
  };

  const handleCheckout = () => {
    const checkoutItems = cartItems.map((item, index) => {
      const id =
        item.itemType === "custom" ? `custom-${index}` : item.product?._id;
      return {
        ...(item.itemType === "custom" ? item.customData : item.product),
        quantity: quantities[id] || 1,
      };
    });

    navigate("/checkout", {
      state: {
        cartItems: checkoutItems,
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal(),
      },
    });
  };

  return (
    <div className="bg-black min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-widest uppercase">
            Your Cart
          </h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 text-sm tracking-wide uppercase transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-gray-950 rounded-2xl shadow-xl p-12 text-center border border-gray-800">
            <div className="mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 mx-auto text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 mb-8">
              Time to add some power under the hood!
            </p>
            <Link to="/">
              <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-red-600/40">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6 ">
              {cartItems
                .filter((item) =>
                  item.itemType === "custom" 
                    ? item.customData?.name
                    : item.product?.name
                )
                .map((item, index) => {
                  const isCustom = item.itemType === "custom";
                  const id = isCustom
                    ? `custom-${index}`
                    : item.product?._id;
                  const name = isCustom
                    ? item.customData?.name
                    : item.product?.name;
                  const price = isCustom
                    ? item.customData?.price
                    : item.product?.price;
                  const image = isCustom
                    ? item.customData?.image
                    : item.product?.image;

                  return (
                    <div
                      key={id}
                      className="bg-gradient-to-br from-slate-900 to-gray-950 border border-gray-800 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-red-600/40 transition-all shadow-md hover:shadow-red-500/10"
                    >
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 overflow-hidden rounded-lg">
                        <img
                          src={image || "/placeholder.png"}
                          alt={name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-col justify-between flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-white">
                            {name}
                          </h3>
                          <p className="text-lg font-bold text-red-500">
                            PKR {(price * (quantities[id] || 1)).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-gray-400 mt-1 text-sm">
                          Unit Price: PKR {price.toFixed(2)}
                        </p>

                        <div className="mt-5 flex justify-between items-center">
                          <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(id, (quantities[id] || 1) - 1)
                              }
                              className="px-3 py-2 text-gray-400 hover:text-white hover:bg-red-600 transition-all"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 text-gray-300 font-semibold">
                              {quantities[id] || 1}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(id, (quantities[id] || 1) + 1)
                              }
                              className="px-3 py-2 text-gray-400 hover:text-white hover:bg-red-600 transition-all"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(id)}
                            className="text-sm text-gray-500 hover:text-red-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <CartSummary
                  subtotal={calculateSubtotal()}
                  shipping={calculateShipping()}
                  tax={calculateTax()}
                  total={calculateTotal()}
                  onCheckout={handleCheckout}
                  disabled={cartItems.length === 0}
                />
                <div className="mt-5 text-center">
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-red-500 text-sm transition"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
