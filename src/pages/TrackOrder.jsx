import React, { useState } from "react";
import axios from "axios";
import Section from "../components/layout/Section";

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setOrderData(null);

    try {
      const { data } = await axios.get(`/api/orders/track/${trackingId}`);

      console.log('data',data);
      
      setOrderData(data);
    } catch (err) {
      console.log(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="py-12 bg-gradient-to-b from-black via-slate-950 to-black text-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-red-600 uppercase tracking-widest">
          Track Your Order
        </h1>

        <div className="max-w-lg mx-auto mb-8 bg-slate-900/80 border border-slate-700 backdrop-blur-md p-6 rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.15)]">
          <p className="mb-4 text-gray-400 text-center">
            Enter your tracking number to view live updates.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Order ID or Tracking Number"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 px-5 py-3 rounded-lg font-semibold uppercase tracking-wide transition-all duration-200 shadow-[0_0_10px_rgba(255,0,0,0.3)]"
            >
              Track
            </button>
          </form>
        </div>

        {loading && (
          <p className="text-center text-gray-400 animate-pulse">Loading order details...</p>
        )}

        {notFound && (
          <p className="text-center text-red-500 font-medium">
            No order found with this tracking number.
          </p>
        )}

      {orderData && (
  <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 backdrop-blur-md p-6 rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.2)] mt-10 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]">
    <h2 className="text-2xl font-bold mb-4 text-red-500">Order Summary</h2>

    <div className="space-y-2 text-gray-300">
      <p><strong>Status:</strong> {orderData.status}</p>
      <p><strong>Paid:</strong> {orderData.isPaid ? "Yes" : "No"}</p>
      <p><strong>Delivered:</strong> {orderData.isDelivered ? "Yes" : "No"}</p>
      <p><strong>Email:</strong> {orderData.email}</p> {/* Added */}
      <p><strong>Phone:</strong> {orderData.phoneNumber}</p> {/* Added */}
    </div>

    <h3 className="text-xl font-semibold mt-6 mb-3 text-red-400">Items</h3>
    <ul className="space-y-3">
      {orderData.items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/70 border border-slate-700 hover:border-red-600 transition-all duration-200"
        >
          <img
            src={
              item.itemType === "standard"
                ? item.product?.image
                : item.customData?.image
            }
            alt={
              item.itemType === "standard"
                ? item.product?.name
                : item.customData?.name
            }
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <p className="font-medium text-gray-100">
              {item.itemType === "standard"
                ? item.product?.name
                : item.customData?.name}
            </p>
            <p className="text-sm text-gray-400">
              Quantity: {item.quantity} × PKR {item.price}
            </p>
          </div>
        </li>
      ))}
    </ul>

    <div className="mt-6">
      <h3 className="text-lg font-semibold text-red-400">Shipping Address</h3>
      <p className="text-gray-300 text-sm mt-1">
        {orderData.shippingAddress.street}, {orderData.shippingAddress.city},{" "}
        {orderData.shippingAddress.state}, {orderData.shippingAddress.country}
      </p>
    </div>

    <div className="mt-6">
      <h3 className="text-lg font-semibold text-red-400">Tracking Events</h3>
      {orderData.trackingEvents.length === 0 ? (
        <p className="text-sm text-gray-400">No tracking updates yet.</p>
      ) : (
        <ul className="text-sm text-gray-300 mt-3 space-y-2">
          {orderData.trackingEvents.map((event, idx) => (
            <li key={idx} className="border-l-4 border-red-600 pl-4">
              <strong>{new Date(event.date).toLocaleDateString()}:</strong>{" "}
              {event.description}{" "}
              {event.location && `(${event.location})`}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="mt-4 text-gray-300 font-semibold border-t border-slate-700 pt-3">
      <strong>Total Price:</strong> PKR {orderData.totalPrice.toFixed(2)}
    </div>
  </div>
)}

      </div>
    </Section>
  );
};

export default TrackOrder;
