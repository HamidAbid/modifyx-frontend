import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext, useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import {
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaHeart,
  FaCog,
} from "react-icons/fa";
import UserChat from "./UserChat";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, fetchUser } = useAuth();
  const { cartItems } = useCart();
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    logout();
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black text-white shadow-md w-full">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        <div className="flex justify-between h-16">
          <div className="flex items-center justify-center ">
            <Link to="/" className="flex items-center font-bold text-xl pr-20">
              MODIFY <span className="text-red-600">X</span>
            </Link>
            <div className="hidden md:ml-6 md:flex justify-center items-center md:space-x-4">
              <Link to="/" className="nav-link hover:text-red-600">
                Home
              </Link>
              <Link to="/packages" className="nav-link hover:text-red-600">
                Packages
              </Link>
              <Link to="/custom-consultation" className="nav-link hover:text-red-600">
                Custom Car Modification
              </Link>
              {/* <Link to="/quiz" className="nav-link hover:text-red-600">
                Flower Quiz
              </Link> */}
              <Link to="/blog" className="nav-link hover:text-red-600">
                Blog
              </Link>
              <Link to="/track-order" className="nav-link hover:text-red-600">
                Track Order
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium btn "
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <Link to="/cart" className="relative px-3 py-2">
              <svg
                className="h-6 w-6 text-white hover:text-white"
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
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="ml-3 relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <span className="text-sm font-medium text-white mr-2">
                    {user.name}
                  </span>
                  <div className=" p-2 rounded-full btn">
                    <FaUser className="h-5 w-5" />
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 text-white bg-black">
                    <div className="py-1 ">
                      <DropdownLink
                        to="/account"
                        icon={<FaUser />}
                        label="My Account"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <DropdownLink
                        to="/account"
                        icon={<FaClipboardList />}
                        label="My Orders"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <DropdownLink
                        to="/account"
                        icon={<FaHeart />}
                        label="My Wishlist"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <DropdownLink
                        to="/account"
                        icon={<FaCog />}
                        label="Settings"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500"
                      >
                        <FaSignOutAlt className="mr-2" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className="ml-3 hover:bg-opacity-80 text-white font-medium py-2 px-4 rounded text-sm transition-all duration-300"
              >
                Sign In / Register
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Link to="/cart" className="relative px-3 py-2">
              <svg
                className="h-6 w-6 text-white"
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
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-white rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 p-2 rounded-md text-white hover:text-white hover:bg-white"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary px-2 pt-2 pb-3 space-y-1">
          <MobileNavLink to="/" label="Home" />
          <MobileNavLink to="/packages" label="Event Organizer" />
          <MobileNavLink to="/custom-consultation" label="Custom Consultation" />
          {/* <MobileNavLink to="/quiz" label="Flower Quiz" /> */}
          <MobileNavLink to="/blog" label="Blog" />
          <MobileNavLink to="/track-order" label="Track Order" />
          {user?.role === "admin" && (
            <MobileNavLink
              to="/admin/dashboard"
              label="Admin Dashboard"
              className="bg-white text-white"
            />
          )}
          {!user && <MobileNavLink to="/register" label="Sign In / Register" />}
          {user && (
            <div className="pt-4 border-t border-white border-opacity-20">
              <MobileNavLink
                to="/account"
                label="Your Account"
                icon={<FaUser />}
              />
              <MobileNavLink
                to="/account"
                label="Orders"
                icon={<FaClipboardList />}
              />
              <MobileNavLink
                to="/account"
                label="Wishlist"
                icon={<FaHeart />}
              />
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:text-white"
              >
                <FaSignOutAlt className="mr-2" /> Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// Reusable dropdown link
const DropdownLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-4 py-2 text-sm text-white hover:bg-red-500"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Link>
);

// Reusable mobile nav link
const MobileNavLink = ({ to, label, icon, className = "" }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 bg-black rounded-md text-base font-medium text-white hover:text-white ${className}`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </Link>
);

export default Navbar;
