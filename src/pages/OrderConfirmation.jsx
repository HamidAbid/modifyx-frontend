import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Use fake delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  useEffect(() => {
    // Check if we have order data from the location state
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      // If no order data, redirect to home
      navigate("/");
    }
  }, [location.state, navigate]);

  // Format date to a readable string
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with success message */}
          <div className="bg-primary text-white px-6 py-10 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="mt-2 text-lg opacity-90">
              Your order has been received and is being processed.
            </p>
          </div>

          {/* Order details */}
          <div className="px-6 py-8">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Order Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(new Date())}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">
                    {order.paymentMethod === "creditCard" && "Credit Card"}
                    {order.paymentMethod === "paypal" && "PayPal"}
                    {order.paymentMethod === "cashOnDelivery" &&
                      "Cash on Delivery"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Delivery</p>
                  <p className="font-medium">{formatDate(deliveryDate)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium">
                    {order.customer.address}, {order.customer.city},{" "}
                    {order.customer.state} {order.customer.zipCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                          PKR {item.price.toFixed(2)}
                        </p>
                      </div>
                      {item.type === "custom" && (
                        <p className="text-xs text-purple-600">
                          Custom Bouquet
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order totals */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">
                    PKR {order.summary.subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">
                    {order.summary.shipping === 0
                      ? "Free"
                      : `$${order.summary.shipping.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Tax</p>
                  <p className="font-medium">
                    PKR {order.summary.tax.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-gray-100 mt-2">
                  <p className="font-medium text-gray-900">Total</p>
                  <p className="font-bold text-gray-900">
                    PKR {order.summary.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* What's next */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What's Next?
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order Confirmation
                      </p>
                      <p className="text-sm text-gray-600">
                        We'll send a confirmation email to{" "}
                        {order.customer.email}
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order Processing
                      </p>
                      <p className="text-sm text-gray-600">
                        Our florists will carefully prepare your bouquet
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Delivery</p>
                      <p className="text-sm text-gray-600">
                        Your flowers will be delivered by{" "}
                        {formatDate(deliveryDate)}
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/" className="btn-primary py-2 px-6 text-center">
                Continue Shopping
              </Link>
              <Link
                to={`/track-order/${order.orderNumber || order._id}`}
                className="btn-primary bg-green-600 hover:bg-green-700 py-2 px-6 text-center text-white rounded-md"
              >
                Track Order
              </Link>
              <button
                onClick={() => window.print()}
                className="btn-white py-2 px-6 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Customer support */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Have questions about your order? <br />
            Contact our customer support at{" "}
            <span className="text-primary font-medium">
              support@bloomandbeyond.com
            </span>{" "}
            or call{" "}
            <span className="text-primary font-medium">+1 234 567 8900</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
