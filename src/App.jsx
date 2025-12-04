import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/authContext"; // useAuth instead of useContext(AuthContext)
import { CartProvider } from "./context/cartContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Required styling

// Pages and Components...
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import EventOrganizer from "./pages/EventOrganizer";
import CustomCar from "./pages/CustomBouquet";
import QuickQuiz from "./pages/QuickQuiz";
import Cart from "./pages/Cart";
import ProductView from "./pages/ProductView";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Products from "./pages/Products";
import OccasionPage from "./pages/OccasionPage";
import QuizProductDetail from "./pages/QuizProductDetail";
import TrackOrder from "./pages/TrackOrder";
import { AuthProvider } from "./context/authContext";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "./utils/stripePromise";
import UserChat from "./components/UserChat";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./pages/ScrollToTop";
import { ProductProvider } from "./context/productContext";
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin" : "/register"}
        replace
      />
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};          

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const { authError, setAuthError } = useAuth();

  return (
    <CartProvider>
      <ProductProvider>
      <div className="min-h-screen flex flex-col">
       <div className="h-16"> {!isAdminPage && <Navbar />}</div>

        <main className={`flex-grow ${isAdminPage ? "w-full" : ""}`}>
          {authError && !isAdminPage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{authError}</span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setAuthError(null)}
              >
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </span>
            </div>
          )}
      <ScrollToTop/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/packages" element={<EventOrganizer />} />
            <Route path="/custom-consultation" element={<CustomCar />} />
            <Route path="/quiz" element={<QuickQuiz />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductView />} />
            <Route
              path="/checkout"
              element={
                <Elements stripe={stripePromise}>
                  <Checkout />
                </Elements>
              }
            />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/*"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<Products />} />
            <Route path="/occasions/:occasion" element={<OccasionPage />} />
            <Route path="/quiz/product/:id" element={<QuizProductDetail />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/track-order/:id" element={<TrackOrder />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>

        {!isAdminPage && (
          <>
            <div className=" flex gap-40">
              <ChatBot />
              
              
            </div>
            
            <Footer />
          </>
        )}
      </div>
      </ProductProvider>
    </CartProvider>
  );
}

const AppWithProviders = () => (
  <AuthProvider>
    <App />
    <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
  </AuthProvider>
);

export default AppWithProviders;
