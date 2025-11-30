import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Components
import UserSidebar from "../components/dashboard/UserSidebar";
import ProfileSection from "../components/user/ProfileSection";
import OrdersSection from "../components/user/OrdersSection";
import WishlistSection from "../components/user/WishlistSection";
import PasswordSection from "../components/user/PasswordSection";
import axios from "axios";

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/register");
    }
  }, [user, navigate]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      await fetchUser();
      console.log(user);
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
    if (user && !userProfile) {
      fetchUserProfile();
    }
  }, [user]);

  // Fetch orders when orders section is active
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
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user && activeSection === "orders") {
      fetchOrders();
    }
  }, [activeSection, user]);

  // Fetch wishlist when wishlist section is active
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/users/wishlist",{ headers: { Authorization: `Bearer ${token}` }}
         );
        setWishlist(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user && activeSection === "wishlist") {
      fetchWishlist();
    }
  }, [activeSection, user]);
  
// update profile
const handleProfileUpdate = async (profileData) => {
  try {
    setLoading(true);

    const { data } = await axios.put(
      '/api/users/profile',
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUserProfile(data); // ✅ includes updated number and address
    setError(null);
    return { success: true };
  } catch (err) {
    console.error('Error updating profile:', err);
    return {
      success: false,
      message: err.response?.data?.message || 'Update failed',
    };
  } finally {
    setLoading(false);
  }
};



  // Handle password change
  const handlePasswordChange = async (passwordData) => {
    try {
      console.log(passwordData)
      setLoading(true);
      const res= await axios.put('/api/users/password', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError(null);
      toast.success('Password changed successfully')
      return { success: true, message: "Password changed successfully" };
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password. Please try again later.");
      
    } finally {
      setLoading(false);
    }
  };

  // Handle wishlist actions
  const handleRemoveFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error("Error updating wishlist:", err);
      setError("Failed to update wishlist. Please try again later.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  

  // Render section
  const renderSection = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            className="mt-2 text-sm underline"
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case "profile":
        return (
          <ProfileSection
            profile={userProfile}
            onUpdate={handleProfileUpdate}
          />
        );
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
        return (
          <ProfileSection
            profile={userProfile}
            onUpdate={handleProfileUpdate}
          />
        );
    }
  };

  if (!user) return null;

  return (
    <div className="w-full  px-4 py-8 bg-slate-950">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-600">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <UserSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={logout}
          />
        </div>
        <div className="w-full md:w-3/4 bg-slate-900 text-white p-6 rounded-lg shadow">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
