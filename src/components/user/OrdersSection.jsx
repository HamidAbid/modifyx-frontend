import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaFileInvoice, FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";

const OrdersSection = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        order.status?.toLowerCase().includes(searchLower) ||
        (order.totalPrice && order.totalPrice.toString().includes(searchTerm))
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "total") {
        return sortOrder === "asc"
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice;
      } else if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-8 bg-slate-800 rounded-lg">
          <p className="text-gray-300">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="mt-2 inline-block btn p-2"
          >
            Start Shopping
          </Link>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No orders match your search.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-primary hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left text-sm font-semibold text-white">
                  Order ID
                </th>
                <th
                  className="p-3 text-left text-sm font-semibold text-white cursor-pointer"
                  onClick={() => handleSortChange("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === "date" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="p-3 text-left text-sm font-semibold text-white cursor-pointer"
                  onClick={() => handleSortChange("total")}
                >
                  <div className="flex items-center">
                    Total
                    {sortBy === "total" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="p-3 text-left text-sm font-semibold text-white cursor-pointer"
                  onClick={() => handleSortChange("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortBy === "status" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-800">
                  <td className="p-3">
                    <span
                      className="font-medium cursor-pointer hover:underline"
                      title="Click to copy"
                      onClick={() => {
                        navigator.clipboard.writeText(order._id);
                        toast.success('Order ID copied to clipboard');
                      }}
                    >
                      {order._id}
                    </span>
                  </td>
                  <td className="p-3">{formatDate(order.createdAt)}</td>
                  <td className="p-3">PKR  {order.totalPrice?.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
