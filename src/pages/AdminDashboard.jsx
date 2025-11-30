import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartLine,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaStar,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaImage,
  FaCalendarAlt,
  FaComments,
  FaNewspaper,
  FaRobot,
  FaCog,
  FaPalette,
  FaQuestionCircle,
  FaMoon,
  FaSun,
  FaArrowRight,
  FaFilter,
  FaEye,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/authContext";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminChat from "./AdminChat";
import { toast } from "react-toastify";
// Sample data (in a real app, this would come from an API)
const sampleData = {
  stats: {
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalusers: 0,
    totalProducts: 0,
    newReviews: 0,
  },

  recentReviews: [],
  products: [],
  dailySalesData: [],
  popularProducts: [],
};

const COLORS = ["#E91E63", "#795548", "#FFBB28", "#FF8042", "#A569BD"];

const AdminDashboard = () => {
  const { user, token, fetchUser, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(true);

  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  // dashboard
  useEffect(() => {
    axios
      .get("/api/admin/dashboard", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Dashboard Data: reach");
        setDashboardStats(res.data.stats || {});
        setRecentOrders(res.data.recentOrders || []);
        setDailySalesData(res.data.dailySales || []);
        setPopularProducts(res.data.topSellingProducts || []);
      })
      .catch((error) => {
        console.log("Error in fetching dashboard data:", error);
      });
  }, []);

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "flowers",
    price: "",
    quantity: "",
    image: "",
  });

  // Product list state
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
const formatLargeNumber = (num) => {
  if (Math.abs(num) >= 1.0e9) {
    // Billions (B)
    return (Math.abs(num) / 1.0e9).toFixed(1) + "B";
  }
  if (Math.abs(num) >= 1.0e6) {
    // Millions (M)
    return (Math.abs(num) / 1.0e6).toFixed(1) + "M";
  }
  if (Math.abs(num) >= 1.0e3) {
    // Thousands (K)
    return (Math.abs(num) / 1.0e3).toFixed(1) + "K";
  }
  // Less than 1000, return as is (with optional formatting if needed)
  return num;
};
  // products
  useEffect(() => {
    axios
      .get(`/api/products?page=${currentPage}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, [currentPage]);

  const handleAddProduct = () => {
    const formattedProduct = {
      ...newProduct,
      quantity: Number(newProduct.stock), // Note: you're using "stock", but your state uses "quantity"
      category: newProduct.category?.trim() ? newProduct.category : "flowers",
    };

    axios
      .post("/api/products", formattedProduct, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setShowAddProductModal(false);
        setNewProduct({
          name: "",
          category: "flowers",
          price: "",
          quantity: "",
          image: "",
        });
        setProducts((prev) => [res.data, ...prev]);
      })
      .catch((err) => {
        console.error("Error adding product:", err.response?.data || err);
        setShowAddProductModal(false);
        setNewProduct({
          name: "",
          category: "flowers",
          price: "",
          quantity: "",
          image: "",
        });
        toast.error("unable to add item, Try again later");
      });
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowEditProductModal(true);
  };

  const saveEditedProduct = () => {
    if (!productToEdit) return;

    axios
      .put(`/api/products/${productToEdit._id}`, productToEdit, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts((prev) =>
          prev.map((p) => (p._id === productToEdit._id ? res.data : p))
        );
        setShowEditProductModal(false);
        setProductToEdit(null);
      })
      .catch((err) => {
        console.error("Error editing product:", err);
      });
  };

  const deleteReview = async (id, type) => {
    console.log(id, type);
    try {
      await axios.delete(`/api/admin/reviews/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      });

      // Remove the review from state
      setReviews((prevReviews) => prevReviews.filter((r) => r._id !== id));

      // Optionally update dashboard stats
      setDashboardStats((prev) => ({
        ...prev,
        newReviews: Math.max(0, prev.newReviews - 1),
      }));
      fetchAllReviews();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };


  const confirmDelete = () => {
    if (!itemToDelete) return;

    const { item, type } = itemToDelete;
    let deleteUrl = "";
    let updateState = () => {};

    if (type === "product") {
      deleteUrl = `/api/products/${item._id}`;
      updateState = () =>
        setProducts((prev) => prev.filter((p) => p._id !== item._id));
    } else if (type === "user") {
      deleteUrl = `/api/admin/users/${item.id}`;
      updateState = () =>
        setUsers((prev) => prev.filter((u) => u.id !== item.id));
    } else {
      console.error("Unknown item type for deletion:", type);
      return;
    }

    axios
      .delete(deleteUrl, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(() => {
        updateState();
        setShowDeleteConfirmation(false);
        setItemToDelete(null);
      })
      .catch((err) => {
        console.error(`Error deleting ${type}:`, err);
      });
  };

  // Order state
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Review state
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviews, setReviews] = useState([]);

  const fetchAllReviews = async () => {
    try {
      const response = await axios.get("/api/admin/reviews", {
        headers: { authorization: `Bearer ${token}` },
      });

      // console.log(response.data);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Car Mod Booking state
  const [bookingFilter, setBookingFilter] = useState("all");
  const [eventBookings, setEventBookings] = useState([]);

  // Blog state
  const [blogFilter, setBlogFilter] = useState("all");
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [blogs, setBlogs] = useState(sampleData.blogs);
  const [newBlog, setNewBlog] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "Admin User",
  });



  // Chatbot state
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [chatbotLogs, setChatbotLogs] = useState([]);
  const [responseToImprove, setResponseToImprove] = useState(null);
  const [showImproveResponseModal, setShowImproveResponseModal] =
    useState(false);
  const [improvedResponse, setImprovedResponse] = useState("");

  // User management state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // Add settings state variables
  const [settingsData, setSettingsData] = useState({
    name: "Admin User",
    email: "admin@floralartistry.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      orders: true,
      lowStock: true,
    },
  });

  const [settingsChangesSaved, setSettingsChangesSaved] = useState(false);
  const [showSettingsConfirmation, setShowSettingsConfirmation] =
    useState(false);

  // Update the saveSettings function with password validation and confirmation dialog
  // const saveSettings = () => {
  //   // First check if password fields are filled, verify they match
  //   if (
  //     settingsData.currentPassword ||
  //     settingsData.newPassword ||
  //     settingsData.confirmPassword
  //   ) {
  //     if (!settingsData.currentPassword) {
  //       toast.success("Please enter your current password");
  //       return;
  //     }

  //     // In a real app, we would verify if the current password is correct
  //     // For demo purposes, let's simulate a check (current password should be "admin123")
  //     if (settingsData.currentPassword !== "admin123") {
  //       toast.error("Current password is incorrect");
  //       return;
  //     }

  //     if (settingsData.newPassword !== settingsData.confirmPassword) {
  //       toast.error("New password and confirm password do not match");
  //       return;
  //     }
  //   }

  //   // Show a confirmation dialog before saving
  //   setItemToDelete(null); // Ensure no other confirmation is showing
  //   setShowSettingsConfirmation(true);
  // };

  // Add the applySettings function to be called after confirmation
  const applySettings = () => {
    // In a real app, this would send the settings to the server
    // console.log("Saving settings:", settingsData);

    // Show a saved confirmation message briefly
    setSettingsChangesSaved(true);
    setTimeout(() => {
      setSettingsChangesSaved(false);
    }, 3000);

    // Reset password fields after saving
    setSettingsData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    // Hide the confirmation dialog
    setShowSettingsConfirmation(false);
  };

  // Add toggleNotification function
  const toggleNotification = (type) => {
    setSettingsData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  // In the useState declarations section
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);



  // Functions to update dashboard stats
  const updateRevenue = (amount) => {
    setDashboardStats((prev) => ({
      ...prev,
      totalSales: parseFloat((prev.totalSales + amount).toFixed(2)),
    }));

    // Update daily sales data for today
    const today = new Date()
      .toLocaleString("en-us", { weekday: "short" })
      .slice(0, 3);
    setDailySalesData((prev) => {
      const newData = [...prev];
      const todayIndex = newData.findIndex((item) => item.day === today);
      if (todayIndex !== -1) {
        newData[todayIndex] = {
          ...newData[todayIndex],
          sales: newData[todayIndex].sales + amount,
        };
      }
      return newData;
    });
  };
  const chartData = dailySalesData.map((item) => ({
    day: item.date,
    sales: item.total,
  }));
  const addOrder = (order) => {
    // Add to recent orders
    setRecentOrders((prev) => [order, ...prev].slice(0, 10));

    // Update order stats
    setDashboardStats((prev) => ({
      ...prev,
      totalOrders: prev.totalOrders + 1,
      pendingOrders: prev.pendingOrders + 1,
    }));

    // Update revenue
    updateRevenue(order.amount);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setRecentOrders((prev) => {
      const newOrders = [...prev];
      const orderIndex = newOrders.findIndex((order) => order.id === orderId);

      if (orderIndex === -1) return prev;

      // Update dashboard stats based on status change
      const oldStatus = newOrders[orderIndex].status.toLowerCase();
      if (oldStatus === "pending" && newStatus.toLowerCase() !== "pending") {
        setDashboardStats((prev) => ({
          ...prev,
          pendingOrders: Math.max(0, prev.pendingOrders - 1),
        }));
      } else if (
        oldStatus !== "pending" &&
        newStatus.toLowerCase() === "pending"
      ) {
        setDashboardStats((prev) => ({
          ...prev,
          pendingOrders: prev.pendingOrders + 1,
        }));
      }

      if (
        newStatus.toLowerCase() === "delivered" ||
        newStatus.toLowerCase() === "completed"
      ) {
        setDashboardStats((prev) => ({
          ...prev,
          completedOrders: prev.completedOrders + 1,
        }));
      }

      // Update the order
      newOrders[orderIndex] = {
        ...newOrders[orderIndex],
        status: newStatus,
      };

      return newOrders;
    });
  };

  const addProduct = (product) => {
    // Generate a new ID
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    const newProductWithId = {
      ...product,
      id: newId,
    };

    // Add to products list
    setProducts((prev) => [...prev, newProductWithId]);

    // Update total products count
    setDashboardStats((prev) => ({
      ...prev,
      totalProducts: prev.totalProducts + 1,
    }));
  };

  const adduser = (user) => {
    // Update user count
    setDashboardStats((prev) => ({
      ...prev,
      totalusers: prev.totalusers + 1,
    }));
  };

  const addReview = (review) => {
    // Add to reviews list
    setReviews((prev) => [review, ...prev]);

    // Update new reviews count
    setDashboardStats((prev) => ({
      ...prev,
      newReviews: prev.newReviews + 1,
    }));
  };

  // Add handleApproveReview function after the addReview function
  const handleApproveReview = (review) => {
    // Update the review status in the reviews array
    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r.id === review._id ? { ...r, status: "Approved" } : r
      )
    );

    // Update dashboard stats if needed
    setDashboardStats((prev) => ({
      ...prev,
      newReviews: Math.max(0, prev.newReviews - 1),
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  const initiateLogout = () => {
    setShowLogoutConfirmation(true);
  };

  // Fix the confirmLogout function to actually log out the user
  const confirmLogout = () => {
    // Log out the user
    logout(); // Remove user from localStorage

    // Navigate to login page
    navigate("/admin");
    setShowLogoutConfirmation(false);
  };

  // Product Modal Component
  const ProductModal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-xl w-full max-w-md p-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <FaTimes />
            </button>
          </div>
          <div>{children}</div>
        </motion.div>
      </div>
    );
  };

  // Confirmation Modal
  const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } rounded-lg shadow-xl w-full max-w-sm p-6`}
        >
          <h3 className="text-lg font-medium mb-3">{title}</h3>
          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {message}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
          onClick={() => setActiveTab("products")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold">
                {formatLargeNumber(dashboardStats.totalSales)}
              </h3>
            </div>
            <div
              className={`${
                darkMode ? "bg-blue-900/50" : "bg-red-100"
              } p-3 rounded-full`}
            >
              <FaChartLine
                className={`${
                  darkMode ? "text-red-600" : "text-red-500"
                } text-xl`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
          onClick={() => setActiveTab("orders")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                Total Orders
              </p>
              <h3 className="text-2xl font-bold">
                {dashboardStats.totalOrders}
              </h3>
              {/* <div className="flex mt-2 text-sm">
                <span className="text-green-500 mr-3">
                  {dashboardStats.completedOrders} Completed
                </span>
                <span className="text-yellow-500">
                  {dashboardStats.pendingOrders} Pending
                </span>
              </div> */}
            </div>
            <div
              className={`${
                darkMode ? "bg-green-900" : "bg-green-100"
              } p-3 rounded-full`}
            >
              <FaShoppingCart
                className={`${
                  darkMode ? "text-green-400" : "text-green-500"
                } text-xl`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
          onClick={() => setActiveTab("users")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                Total users
              </p>
              <h3 className="text-2xl font-bold">
                {dashboardStats.totalCustomers}
              </h3>
            </div>
            <div
              className={`${
                darkMode ? "bg-purple-900" : "bg-purple-100"
              } p-3 rounded-full`}
            >
              <FaUsers
                className={`${
                  darkMode ? "text-purple-400" : "text-purple-500"
                } text-xl`}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
          onClick={() => setActiveTab("reviews")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                New Reviews
              </p>
              <h3 className="text-2xl font-bold">
                {dashboardStats.totalReviews}
              </h3>
            </div>
            <div
              className={`${
                darkMode ? "bg-yellow-900" : "bg-yellow-100"
              } p-3 rounded-full`}
            >
              <FaStar
                className={`${
                  darkMode ? "text-yellow-400" : "text-yellow-500"
                } text-xl`}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">Daily Sales</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#555" : "#eee"}
                />
                <XAxis dataKey="day" stroke={darkMode ? "#aaa" : "#666"} />
                <YAxis stroke={darkMode ? "#aaa" : "#666"} />
                <Tooltip
                  contentStyle={
                    darkMode
                      ? {
                          backgroundColor: "#333",
                          color: "#fff",
                          border: "none",
                        }
                      : {}
                  }
                />
                <Bar dataKey="sales" fill="#8884d8" radius={[5, 5, 0, 0]}>
                  {dailySalesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-4">Popular Products</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="sold"
                  label
                >
                  {popularProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={
                    darkMode
                      ? {
                          backgroundColor: "#333",
                          color: "#fff",
                          border: "none",
                        }
                      : {}
                  }
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-primary hover:underline flex items-center"
            >
              View All <FaArrowRight className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr
                  className={`${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } border-b`}
                >
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">user</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className={`${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-700"
                        : "border-gray-200 hover:bg-red-50"
                    } border-b transition-colors`}
                  >
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3">{order.amount}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-red-100 text-blue-800"
                            : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3">{order.date}</td>
                    <td className="py-3">
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <FaEdit title="View Details" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProducts = () => (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } p-6 rounded-lg shadow-md`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Product Management</h3>
        <button
          onClick={() => setShowAddProductModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Product
        </button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className={`w-full px-4 py-2 pl-10 rounded-lg ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "border"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr
              className={`${
                darkMode ? "border-gray-700" : "border-gray-200"
              } border-b`}
            >
              <th className="text-left py-2">Image</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Price</th>
              <th className="text-left py-2">Stock</th>
              
              <th className="text-left py-2">Status</th>
              <th className="text-left  py-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className={`${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-red-50"
                } border-b transition-colors`}
              >
                <td className="py-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="py-3 max-w-60">{product.name}</td>
                <td className="py-3">{product.category}</td>
                <td className="py-3"> {formatLargeNumber(product.price)}</td>
                <td className="py-3">{product.stock}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="py-3 flex align-center  min-h-[75px]">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-1 mr-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FaEdit title="Edit" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product, "product")}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrash title="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Showing 1-{products.length} of {products.length} products
        </div>
        <div className="flex">
          {/* <button
            className={`mx-1 px-3 py-1 rounded-md ${
              darkMode ? "bg-gray-600 text-white" : "bg-primary text-white"
            }`}
          >
            1
          </button> */}
        </div>
      </div>
    </div>
  );

  // Move these functions outside of renderOrders
  const filterOrders = () => {
    if (selectedStatus === "all") return recentOrders;
    return recentOrders.filter(
      (order) => order.status.toLowerCase() === selectedStatus.toLowerCase()
    );
  };

  const handleStatusChange = (order, newStatus) => {
    // console.log(order.id, newStatus);
    axios
      .put(
        `/api/admin/orders/${order.id}/status`,
        { status: newStatus },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const updatedOrders = recentOrders.map((o) =>
          o.id === order.id ? { ...o, status: newStatus } : o
        );
        setRecentOrders(updatedOrders);

        // console.log(`Order ${order.id} status updated to ${newStatus}`);
      })
      .catch((err) => {
        console.error("Failed to update order status", err);
      });
  };
  const filteredOrders = filterOrders();
  const [showTracking, setShowTracking] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!selectedOrderId) return;

      setLoading(true);
      setNotFound(false);
      setOrderData(null);

      try {
        const { data } = await axios.get(
          `/api/orders/track/${selectedOrderId}`
        );
        setOrderData(data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [selectedOrderId]);
  const renderOrders = () => {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        } rounded-lg shadow-md p-6`}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">
            Orders Management
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
           
            <select
              className={`rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-primary"
                  : "border border-gray-300 focus:ring-primary"
              }`}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className={`${darkMode ? "bg-gray-700" : "bg-red-50"}`}>
              <tr
                className={`${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {[
                  "Order ID",
                  "User",
                  "Amount",
                  "Date",
                  "Status",
                  "Actions",
                ].map((label) => (
                  <th
                    key={label}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`${
                darkMode
                  ? "bg-gray-800 divide-gray-700"
                  : "bg-white divide-gray-200"
              }`}
            >
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? darkMode
                            ? "bg-green-800 text-green-100"
                            : "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? darkMode
                            ? "bg-yellow-800 text-yellow-100"
                            : "bg-yellow-100 text-yellow-800"
                          : order.status === "Processing"
                          ? darkMode
                            ? "bg-red-800 text-blue-100"
                            : "bg-red-100 text-blue-800"
                          : order.status === "Shipped"
                          ? darkMode
                            ? "bg-purple-800 text-purple-100"
                            : "bg-purple-100 text-purple-800"
                          : order.status === "Cancelled"
                          ? darkMode
                            ? "bg-red-800 text-red-100"
                            : "bg-red-100 text-red-800"
                          : ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex  space-x-8">
                      <button
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setShowTracking(true);
                        }}
                        className={`${
                          darkMode
                            ? "text-red-600 hover:text-red-900"
                            : "text-red-600 hover:text-red-900"
                        } text-lg`}
                      >
                        <FaEye title="view" />
                      </button>

                      <div className="relative group flex ">
                        <button
                          className={`${
                            darkMode
                              ? "text-red-600 hover:text-red-900"
                              : "text-red-600 hover:text-red-900"
                          } text-lg`}
                        >
                          <FaEdit title="Edit" />
                        </button>

                        <div
                          className={`fixed right-8 mt-2 w-48 rounded-md shadow-lg z-10 hidden group-hover:block ${
                            darkMode ? "bg-gray-700" : "bg-white"
                          }`}
                        >
                          <div className="py-1">
                            {[
                              "Pending",
                              "Processing",
                              "Shipped",
                              "Delivered",
                              "Cancelled",
                            ].map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(order, status)
                                }
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  darkMode
                                    ? "text-gray-200 hover:bg-gray-600"
                                    : "text-gray-700 hover:bg-red-100"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showTracking && selectedOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm px-4">
            <div
              className={`w-full max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] ${
                darkMode ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">View Order</h2>
                <button
                  onClick={() => {
                    setShowTracking(false);
                    setSelectedOrderId(null);
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Close
                </button>
              </div>

              {loading ? (
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Loading order details...
                </p>
              ) : notFound ? (
                <p className="text-red-500 text-sm">
                  No order found with this tracking number.
                </p>
              ) : orderData ? (
                <div>
                  <p className="mb-2">
                    <strong className="text-white">Status:</strong>{" "}
                    {orderData.status}
                  </p>
                  <p className="mb-2">
                    <strong className="text-white">Paid:</strong>{" "}
                    {orderData.isPaid ? "Yes" : "No"}
                  </p>
                  <p className="mb-2">
                    <strong className="text-white">Delivered:</strong>{" "}
                    {orderData.status === "Delivered" ? "Yes" : "No"}
                  </p>
<p className="mb-2"><strong>Email:</strong> {orderData.email}</p> {/* Added */}
      <p className="mb-2"><strong>Phone:</strong> {orderData.phoneNumber}</p> {/* Added */}
                  <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
                  <ul className="space-y-3">
                    {orderData.items.map((item, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-4 p-2 rounded-md ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
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
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">
                            {item.itemType === "standard"
                              ? item.product?.name
                              : item.customData?.name}
                          </p>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            Quantity: {item.quantity} × PKR {item.price}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {orderData.shippingAddress.street},{" "}
                      {orderData.shippingAddress.city},{" "}
                      {orderData.shippingAddress.state},{" "}
                      {orderData.shippingAddress.country}
                    </p>
                  </div>

                  <div
                    className={`mt-4 text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <strong className="text-white">Total Price:</strong> PKR{" "}
                    {orderData.totalPrice.toFixed(2)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  };

  

  // Add functions to handle Car Mod Booking actions
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);

 const handleConfirmBooking = async (booking) => {
  try {
    const res = await axios.put(
      `/api/admin/carmodrequests/${booking._id}/status`,
      { status: "accepted" },
      { headers: { authorization: `Bearer ${token}` } }
    );

    setEventBookings((prevBookings) =>
      prevBookings.map((b) =>
        b._id === booking._id ? res.data.request : b
      )
    );
  } catch (error) {
    console.error("Error confirming booking", error);
  }
};


const fetchBookings = async () => {
  try {
    const res = await axios.get("/api/admin/carmodrequests", {
      headers: { authorization: `Bearer ${token}` },
    });
    console.log('response from booking',res)
    setEventBookings(res.data);
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
};
useEffect(()=>{
  fetchBookings()
},[])

const handleRejectBooking = async (booking) => {
  try {
    const res = await axios.put(
      `/api/admin/carmodrequests/${booking._id}/status`,
      { status: "rejected" },
      { headers: { authorization: `Bearer ${token}` } }
    );

    setEventBookings((prevBookings) =>
      prevBookings.map((b) =>
        b._id === booking._id ? res.data.request : b
      )
    );
  } catch (error) {
    console.error("Error rejecting booking", error);
  }
};

const handleResetBookingStatus = async (booking) => {
  try {
    const res = await axios.put(
      `/api/admin/carmodrequests/${booking._id}/status`,
      { status: "pending" },
      { headers: { authorization: `Bearer ${token}` } }
    );

    setEventBookings((prevBookings) =>
      prevBookings.map((b) =>
        b._id === booking._id ? res.data.request : b
      )
    );
  } catch (error) {
    console.error("Error resetting booking status", error);
  }
};


 const viewBookingDetails = (booking) => {
  setSelectedBooking(booking);
  setShowBookingDetailsModal(true);
};



  const deleteBookingById = async (id) => {
  try {
    const res = await axios.delete(`/api/admin/carmodrequests/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchBookings();
    return res.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};


  // Update Car Mod Bookings section with Rejected filter and View Details for all statuses
  const renderEventBookings = () => (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } p-6 rounded-lg shadow-md`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Car Mod Booking</h3>
        <div className="flex space-x-2">
          {["all", "confirmed", "pending", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setBookingFilter(status)}
              className={`px-3 py-1 rounded-lg ${
                bookingFilter === status
                  ? darkMode
                    ? "bg-red-800"
                    : "bg-red-100 text-blue-800"
                  : darkMode
                  ? "bg-gray-700"
                  : "bg-red-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {eventBookings
          ?.filter(
            (booking) =>
              bookingFilter === "all" ||
              booking.status.toLowerCase() === bookingFilter.toLowerCase()
          )
          .map((booking) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${
                darkMode ? "bg-gray-700" : "bg-red-50"
              } p-4 rounded-lg shadow relative border`}
            >
              {/* Delete icon in bottom left corner */}
              

              <div className="flex justify-between items-start mb-3 ">
                <div>
                  <h4 className="font-medium">{booking.eventType}</h4>
                  <p
                    className={`${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {booking.name}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } text-sm space-y-1`}
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>{booking.createdAt}</span>
                </div>
                <p className="mt-2 font-medium">Requirements:</p>
                <p className="ml-2">{booking.message}</p>
              </div>
<div className="flex justify-between items-center mt-4">
  <div className=" ">
                <button
                  onClick={() => deleteBookingById(booking._id)}
                  className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                  title="Delete booking"
                >
                  <FaTrash size={16} />
                </button>
              </div>
              <div className="flex  justify-end space-x-2 ">
                
                <button
                  onClick={() => viewBookingDetails(booking)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  View Details
                </button>

                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleConfirmBooking(booking)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleRejectBooking(booking)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}

                {booking.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => handleRejectBooking(booking)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleResetBookingStatus(booking)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Set to Pending
                    </button>
                  </>
                )}

                {booking.status === "rejected" && (
                  <>
                    <button
                      onClick={() => handleConfirmBooking(booking)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleResetBookingStatus(booking)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Set to Pending
                    </button>
                  </>
                )}
              </div>
</div>
            </motion.div>
          ))}
      </div>
    </div>
  );


  const renderReviews = () => (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } p-6 rounded-lg shadow-md`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Review Management</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              darkMode ? "bg-gray-700" : "bg-red-50"
            } p-4 rounded-lg shadow`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{review.productName}</h4>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {review.author}
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < review.rating
                        ? "text-yellow-400"
                        : darkMode
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p
              className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-2`}
            >
              {review.review}
            </p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">{review.date}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => deleteReview(review._id, "review")}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBlogs = () => (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } p-6 rounded-lg shadow-md`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Blog Management</h3>
        <button
          onClick={() => setShowAddBlogModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
        >
          <FaPlus className="mr-2" />
          New Blog Post
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr
              className={`${
                darkMode ? "border-gray-700" : "border-gray-200"
              } border-b`}
            >
              <th className="text-left py-2">ID</th>
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Author</th>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className={`${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-red-50"
                } border-b transition-colors`}
              >
                <td className="py-3">{blog._id}</td>
                <td className="py-3">
                  <div>
                    <div className="font-medium">{blog.title}</div>
                    <div
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } text-sm`}
                    >
                      {blog.excerpt}
                    </div>
                  </div>
                </td>
                <td className="py-3">{blog.author}</td>
                <td className="py-3">{blog.createdAt}</td>
                <td className="py-3 flex">
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="p-1 mr-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <FaEdit title="Edit" />
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id, "blog")}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTrash title="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const fetchChatBotLogs = async () => {
    try {
      const res = await axios.get("/api/admin/chatlog", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChatbotLogs(res.data);
    } catch (error) {
      console.error("Failed to fetch chatbot logs:", error);
    }
  };

  useEffect(() => {
    fetchChatBotLogs();
  }, [token]);

  const clearChatBotLogs = async () => {
    try {
      const response = await axios.delete("/api/admin/chatlog", {
        headers: {
          Authorization: `Bearer ${token}`, // include token if auth is needed
        },
      });
      setChatbotLogs([]); // Clear chat logs in the UI state
    } catch (error) {
      console.error("Failed to clear chat logs:", error);
    }
  };
  const renderChatbotLogs = () => (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } p-6 rounded-lg shadow-md`}
    >
      <div className="mb-6 flex justify-between align-center">
        <h3 className="text-lg font-semibold">Chatbot Logs</h3>
        <button onClick={clearChatBotLogs} className=" ">
          Clear Chat
        </button>
      </div>
      <div className="space-y-4">
        {chatbotLogs.map((log) => (
          <motion.div
            key={log._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${
              darkMode ? "bg-gray-700" : "bg-red-50"
            } p-4 rounded-lg shadow`}
          >
            <div className="flex justify-between mb-2">
              <div className="font-medium"></div>
              <div
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                {log.timestamp}
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <div
                className={`self-end max-w-[80%] ${
                  darkMode ? "bg-gray-600" : "bg-red-200"
                } p-3 rounded-lg`}
              >
                <p>{log.userText}</p>
              </div>
              <div
                className={`self-start max-w-[80%] ${
                  darkMode ? "bg-red-600 text-white" : "bg-green-100"
                } p-3 rounded-lg`}
              >
                <p>{log.botText}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
  // alluser
  useEffect(() => {
    axios
      .get("/api/admin/users", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  // Move these functions outside of renderUsers
  const handleAddUser = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("password must be match");
      return;
    }
    if (newUser.password.length < 6) {
      toast.error("password must be greater then 6 ");
      return;
    } else {
      const userToAdd = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password, // Ideally, collect from input or set securely
      };

      axios
        .post("/api/admin/users", userToAdd, {
          headers: { authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUsers((prevUsers) => [...prevUsers, res.data]); // Response includes id, name, email, date, orders
          setShowAddUserModal(false);
          setNewUser({
            name: "",
            email: "",
            role: "user",
            password: "*******",
          });
          console.log("User added successfully:");
        })
        .catch((err) => {
          console.error("Error adding user:", err);
        });
    }
  };

  // handleDeleteClick
  const handleDeleteUser = (user) => {
    setItemToDelete({ item: user, type: "user" });
    setShowDeleteConfirmation(true);
  };
  // confirmDelete

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowEditUserModal(true);
  };

  const saveEditedUser = async () => {
    try {
      // Prepare update payload (only include fields that were changed or present)
      const { id, name, email, role, password } = userToEdit;
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (password) updateData.password = password;
      console.log(updateData);
      // Send PATCH/PUT request to backend
      const { data: updatedUser } = await axios.patch(
        `/api/admin/users/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // if your route is protected
          },
        }
      );

      // Update user in local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );

      // Close modal and reset edit state
      setShowEditUserModal(false);
      setUserToEdit(null);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const renderUsers = () => {
    return (
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        } p-6 rounded-lg shadow-md`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">User Management</h3>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
          >
            <FaPlus className="mr-2" />
            Add User
          </button>
        </div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 pl-10 rounded-lg ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "border"
              }`}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr
                className={`${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } border-b`}
              >
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Registration Date</th>
                <th className="text-left py-2">Orders</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className={`${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-red-50"
                  } border-b transition-colors`}
                >
                  <td className="py-3">{user.id}</td>
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.date}</td>
                  <td className="py-3">{user.orders}</td>
                  <td className="py-3 flex">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-1 mr-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <FaEdit title="Edit" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user, "user")}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash title="Delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remove the Add User Modal and Edit User Modal from here */}
      </div>
    );
  };

  // Add this component before the return statement
  const OrderDetailsModal = ({ show, onClose, order }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div
          className={`relative max-w-3xl w-full m-4 p-6 rounded-lg shadow-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                Order ID:
              </p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                Date:
              </p>
              <p className="font-medium">{order.date}</p>
            </div>
            <div>
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                user:
              </p>
              <p className="font-medium">{order.user}</p>
            </div>
            <div>
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                Status:
              </p>
              <p className="font-medium">{order.status}</p>
            </div>
            <div>
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                Total Amount:
              </p>
              <p className="font-medium">{formatCurrency(order.amount)}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr
                  className={`${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  } border-b`}
                >
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Price</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {(
                  order.items || [
                    {
                      id: 1,
                      name: "Red Rose Bouquet",
                      quantity: 1,
                      price: 49.99,
                    },
                    {
                      id: 2,
                      name: "Birthday Special",
                      quantity: 1,
                      price: 59.99,
                    },
                  ]
                ).map((item) => (
                  <tr
                    key={item._id}
                    className={`${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    } border-b`}
                  >
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">{formatCurrency(item.price)}</td>
                    <td className="py-2">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              Close
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    );
  };
  const getBlogs = async () => {
    try {
      const res = await axios.get("/api/admin/blog", {
        headers: { authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`/api/admin/blog/${id}`, {
        headers: {
          authorization: `Bearer ${token}`, // include this only if the route is protected
        },
      });

      // Optionally update local state after successful deletion
      getBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Error deleting blog. Please try again.");
    }
  };

  const handleAddBlog = async () => {
    try {
      const response = await axios.post(
        "/api/admin/blogs",
        {
          title: newBlog.title,
          excerpt: newBlog.excerpt,
          image: newBlog.image,
          content: newBlog.content,
          author: newBlog.author || "Admin User",
          status: "published", // or use "draft" if applicable
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      const savedBlog = response.data;

      // Update frontend state with newly created blog
      setBlogs((prevBlogs) => [savedBlog, ...prevBlogs]);

      // Close modal and reset form
      setShowAddBlogModal(false);
      setNewBlog({
        title: "",
        excerpt: "",
        content: "",
        author: "Admin User",
      });
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Failed to add blog. Please try again.");
    }
  };

  const handleEditBlog = (blog) => {
    setBlogToEdit(blog);
    setShowEditBlogModal(true);
  };

  const saveEditedBlog = async () => {
    try {
      const id = blogToEdit._id;
      const response = await axios.put(
        `/api/admin/blog/${id}`, // assuming _id is the MongoDB identifier
        {
          title: blogToEdit.title,
          excerpt: blogToEdit.excerpt,
          image: blogToEdit.image,
          content: blogToEdit.content,
          author: blogToEdit.author || "Admin User",
          status: blogToEdit.status || "published",
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      const updatedBlog = response.data;

      // Update the blog in the blogs array
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === updatedBlog._id ? updatedBlog : blog
        )
      );

      setShowEditBlogModal(false);
      setBlogToEdit(null);
      toast.success("Blog updated successfully.");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-900 text-white" : ""
      }`}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-72 flex-shrink-0 fixed inset-y-0 left-0 z-20 md:relative md:translate-x-0 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg overflow-hidden`}
            >
              <div className="flex flex-col h-full p-5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <span
                      className={`text-xl font-bold ${
                        darkMode ? "text-red-600" : "text-gray-800"
                      }`}
                    >
                      Admin Dashboard
                    </span>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white "
                  >
                    <FaTimes />
                  </button>
                </div>

                <nav className="space-y-2 flex-grow overflow-y-auto">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "overview"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaChartLine className="mr-3" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "products"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaBox className="mr-3" />
                    Products
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "orders"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaShoppingCart className="mr-3" />
                    Orders
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "users"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaUsers className="mr-3" />
                    Users
                  </button>

               
                  <button
                    onClick={() => setActiveTab("eventBookings")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "eventBookings"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaCalendarAlt className="mr-3" />
                    Car Mod Booking
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "reviews"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaStar className="mr-3" />
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab("blogs")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "blogs"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaNewspaper className="mr-3" />
                    Blogs
                  </button>
                  <button
                    onClick={() => setActiveTab("chatbotLogs")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "chatbotLogs"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaRobot className="mr-3" />
                    Chatbot Logs
                  </button>
                  <button
                    onClick={() => setActiveTab("Chat")}
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "Chat"
                        ? "bg-red-600 text-white"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaCog className="mr-3" />
                    chat support
                  </button>
                 
                 </nav>
                  <NavLink to='/'
                    
                    className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === "backtohome"
                        ? "bg-red-600 text-white "
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-red-100"
                    }`}
                  >
                    <FaChartLine className="mr-3" />
                    Back to Home
                  </NavLink>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={initiateLogout}
                    className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Top Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {/* Mobile toggle */}
                <button
                  onClick={toggleSidebar}
                  className="md:hidden mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <FaBars />
                </button>
                <h1
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "products" && "Product Management"}
                  {activeTab === "orders" && "Order Management"}
                  {activeTab === "users" && "User Management"}
                  {activeTab === "CustomCar" && "Custom Car"}
              
                  {activeTab === "eventBookings" && "Car Mod Bookings"}
                  {activeTab === "reviews" && "Reviews"}
                  {activeTab === "blogs" && "Blog Management"}
                  {activeTab === "chatbotLogs" && "Chatbot Logs"}
                  {activeTab === "settings" && "Settings"}
                  {activeTab === "Chat" && "chat"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                
                <div
                  className={`hidden md:flex items-center space-x-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <span className="font-medium">
                    {user?.name || "Admin User"}
                  </span>
                  
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pb-8">
              {activeTab === "overview" && renderOverview()}
              {activeTab === "products" && renderProducts()}
              {activeTab === "orders" && renderOrders()}
              {activeTab === "users" && renderUsers()}
    
              {activeTab === "eventBookings" && renderEventBookings()}
              {activeTab === "reviews" && renderReviews()}
              {activeTab === "blogs" && renderBlogs()}
              {activeTab === "chatbotLogs" && renderChatbotLogs()}
              {activeTab === "Chat" && <AdminChat darkMode={darkMode} />}
            </div>
          </div>
        </div>
      </div>

      {/* Dark overlay when sidebar is open on mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-md p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProduct();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="Red Rose Bouquet"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  >
                    <option value="flowers">Flowers</option>
                    <option value="gifts">Gifts</option>
                    <option value="chocolates">Chocolates</option>
                    <option value="cards">Cards</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border"
                      }`}
                      placeholder="29.99"
                    />
                  </div>

                  <div>
                    <label
                      className={`block mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border"
                      }`}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && productToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-md p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Product</h3>
              <button
                onClick={() => setShowEditProductModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedProduct();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productToEdit.name}
                    onChange={(e) =>
                      setProductToEdit({
                        ...productToEdit,
                        name: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category
                  </label>
                  <select
                    value={productToEdit.category}
                    onChange={(e) =>
                      setProductToEdit({
                        ...productToEdit,
                        category: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  >
                    <option value="flowers">Flowers</option>
                    <option value="gifts">Gifts</option>
                    <option value="chocolates">Chocolates</option>
                    <option value="cards">Cards</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={productToEdit.price}
                      onChange={(e) =>
                        setProductToEdit({
                          ...productToEdit,
                          price: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productToEdit.stock}
                      onChange={(e) =>
                        setProductToEdit({
                          ...productToEdit,
                          stock: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Image Preview
                  </label>
                  <div className="mb-2">
                    <img
                      src={productToEdit.image}
                      alt={productToEdit.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                  <input
                    type="text"
                    value={productToEdit.image}
                    onChange={(e) =>
                      setProductToEdit({
                        ...productToEdit,
                        image: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditProductModal(false)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-sm p-6`}
          >
            <h3 className="text-lg font-medium mb-3">Confirm Deletion</h3>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Are you sure you want to delete this {itemToDelete?.type}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-sm p-6`}
          >
            <h3 className="text-lg font-medium mb-3">Logout Confirmation</h3>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-md p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Role
                  </label>
                  <select
                    value={newUser.role || "user"}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  >
                    <option value="user">user</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && userToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-md p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit User</h3>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedUser();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userToEdit.name}
                    onChange={(e) =>
                      setUserToEdit({ ...userToEdit, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={userToEdit.email}
                    onChange={(e) =>
                      setUserToEdit({ ...userToEdit, email: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Role
                  </label>
                  <select
                    value={userToEdit.role || "user"}
                    onChange={(e) =>
                      setUserToEdit({ ...userToEdit, role: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  >
                    <option value="user">user</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          show={showOrderDetailsModal}
          onClose={() => setShowOrderDetailsModal(false)}
          order={selectedOrder}
        />
      )}

      {/* Car Mod Booking Details Modal */}
      {selectedBooking && showBookingDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div
            className={`relative max-w-3xl w-full m-4 p-6 rounded-lg shadow-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            }`}
          >
            <button
              onClick={() => setShowBookingDetailsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4">
               Booking Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              
              <div>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  user:
                </p>
                <p className="font-medium">{selectedBooking.name}</p>
              </div>
              <div>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  Number:
                </p>
                <p className="font-medium">{selectedBooking.phone}</p>
              </div>
              <div>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  Email:
                </p>
                <p className="font-medium">{selectedBooking.email}</p>
              </div>
              <div>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  Package:
                </p>
                <p className="font-medium">{selectedBooking.carPackage}</p>
              </div>
              <div>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  Date:
                </p>
                <p className="font-medium">{selectedBooking.createdAt}</p>
              </div>

              <div>
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } mb-1`}
                >
                  Status:
                </p>
                <p
                  className={`font-medium ${
                    selectedBooking.status === "confirmed" ||
                    selectedBooking.status === "confirmed"
                      ? "text-green-500"
                      : selectedBooking.status === "rejected" ||
                        selectedBooking.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {selectedBooking.status}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-600"
                } mb-1`}
              >
                Requirements:
              </p>
              <p className="border p-3 rounded-lg">{selectedBooking.message}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleConfirmBooking(selectedBooking);
                      setShowBookingDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => {
                      handleRejectBooking(selectedBooking);
                      setShowBookingDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Reject Booking
                  </button>
                </>
              )}
              {selectedBooking.status === "confirmed" && (
                <button
                  onClick={() => {
                    handleRejectBooking(selectedBooking);
                    setShowBookingDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Reject Booking
                </button>
              )}
              {selectedBooking.status === "rejected" && (
                <button
                  onClick={() => {
                    handleConfirmBooking(selectedBooking);
                    setShowBookingDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Confirm Booking
                </button>
              )}
              <button
                onClick={() => setShowBookingDetailsModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Blog Post Modal */}
      {showAddBlogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-2xl p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Blog Post</h3>
              <button
                onClick={() => setShowAddBlogModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddBlog();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlog.title}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, title: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="Enter blog title"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Excerpt
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlog.excerpt}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, excerpt: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="Brief summary of the blog post"
                  />
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Image
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlog.image}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, image: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="Image URL"
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Content
                  </label>
                  <textarea
                    required
                    value={newBlog.content}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, content: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    rows="6"
                    placeholder="Enter blog content"
                  ></textarea>
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) =>
                      setNewBlog({ ...newBlog, author: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    placeholder="Admin User"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddBlogModal(false)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Add Post
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditBlogModal && blogToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-2xl p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Blog Post</h3>
              <button
                onClick={() => setShowEditBlogModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedBlog();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={blogToEdit.title}
                    onChange={(e) =>
                      setBlogToEdit({ ...blogToEdit, title: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Excerpt
                  </label>
                  <input
                    type="text"
                    required
                    value={blogToEdit.excerpt}
                    onChange={(e) =>
                      setBlogToEdit({ ...blogToEdit, excerpt: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    value={blogToEdit.author}
                    onChange={(e) =>
                      setBlogToEdit({ ...blogToEdit, author: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditBlogModal(false)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showImproveResponseModal && responseToImprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } rounded-lg shadow-xl w-full max-w-2xl p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Improve Chatbot Response
              </h3>
              <button
                onClick={() => setShowImproveResponseModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    User Query
                  </label>
                  <div
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-red-100"
                    }`}
                  >
                    {responseToImprove.query}
                  </div>
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Response
                  </label>
                  <div
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-red-100"
                    }`}
                  >
                    {responseToImprove.response}
                  </div>
                </div>

                <div>
                  <label
                    className={`block mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Improved Response
                  </label>
                  <textarea
                    required
                    value={improvedResponse}
                    onChange={(e) => setImprovedResponse(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border"
                    }`}
                    rows="4"
                    placeholder="Enter improved response..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => setShowImproveResponseModal(false)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                >
                  Save Response
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showSettingsConfirmation && (
        <ConfirmationModal
          show={showSettingsConfirmation}
          onClose={() => setShowSettingsConfirmation(false)}
          onConfirm={applySettings}
          title="Save Changes"
          message="Are you sure you want to save these changes?"
        />
      )}
    </div>
  );
};

export default AdminDashboard;
