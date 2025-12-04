import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Components
import UserSidebar from "../components/dashboard/UserSidebar";
import ProfileSection from "../components/user/ProfileSection";
import OrdersSection from "../components/user/OrdersSection";
import WishlistSection from "../components/user/WishlistSection";
import PasswordSection from "../components/user/PasswordSection";
import axios from "axios";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar state
  const sidebarRef = useRef(null);

  const { token, user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/register");
  }, [user, navigate]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      await fetchUser();
      setUserProfile(user);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !userProfile) fetchUserProfile();
  }, [user]);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user && activeSection === "orders") fetchOrders();
  }, [activeSection, user]);

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/users/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    if (user && activeSection === "wishlist") fetchWishlist();
  }, [activeSection, user]);

  // Profile Update
  const handleProfileUpdate = async (profileData) => {
    try {
      setLoading(true);
      const { data } = await axios.put("/api/users/profile", profileData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(data);
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Password Change
  const handlePasswordChange = async (passwordData) => {
    try {
      setLoading(true);
      await axios.put("/api/users/password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Password changed successfully");
      return { success: true };
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  // Remove Wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data);
      return { success: true };
    } catch (err) {
      console.error("Error updating wishlist:", err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Section Renderer
  const renderSection = () => {
    if (loading)
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );

    if (error)
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      );

    switch (activeSection) {
      case "profile":
        return <ProfileSection profile={userProfile} onUpdate={handleProfileUpdate} />;
      case "orders":
        return <OrdersSection orders={orders} />;
      case "wishlist":
        return (
          <WishlistSection
            wishlist={wishlist}
            onRemove={handleRemoveFromWishlist}
          />
        );
      case "password":
        return <PasswordSection onChangePassword={handlePasswordChange} />;
      default:
        return <ProfileSection profile={userProfile} onUpdate={handleProfileUpdate} />;
    }
  };

  if (!user) return null;

  return (
    <div className="w-full  px-4 sm:px-6 lg:px-8 py-8 bg-slate-950 min-h-screen">

      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden  top-4 left-4 z-50 bg-red-600 text-white p-2 px-3 rounded-lg shadow"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-red-600 mt-10 md:mt-0">
        My Account
      </h1>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`
            fixed md:static top-0 left-0 h-full w-64 bg-slate-900 text-white
            shadow-lg z-40 transform transition-transform duration-300 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0
          `}
        >
          <UserSidebar
            activeSection={activeSection}
            setActiveSection={(section) => {
              setActiveSection(section);
              setSidebarOpen(false); // close sidebar on link click
            }}
            onLogout={() => {
              logout();
              setSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 bg-slate-900 text-white p-4 sm:p-6 rounded-lg shadow-md min-h-[400px]">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
