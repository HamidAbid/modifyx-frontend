import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import {
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaHeart,
  FaCog,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const navRef = useRef(null);
  const location = useLocation();

  const handleSignOut = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu and dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav
      ref={navRef}
      className="bg-black  text-white shadow-md w-full fixed top-0 z-50"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center   h-16">
          {/* Logo + Desktop Links */}
          <div className="flex  justify-between items-center gap-20">
            <Link to="/" className="font-bold text-2xl tracking-wide">
              MODIFY <span className="text-red-600">X</span>
            </Link>

            <div className="hidden lg:flex  lg:items-center space-x-6 text-sm font-medium ">
              <NavLink to="/" label="Home" />
              <NavLink to="/packages" label="Packages" />
              <NavLink to="/custom-consultation" label="Custom Car Modification" />
              <NavLink to="/blog" label="Blog" />
              <NavLink to="/track-order" label="Track Order" />

              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden m lg:flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <CartIcon />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 px-2 py-1 text-[10px] font-bold bg-red-600 text-white rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm">{user.name}</span>
                  <div className="p-2 rounded-full bg-gray-800">
                    <FaUser />
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded shadow-lg bg-black border border-gray-700">
                    <DropdownLink to="/account" icon={<FaUser />} label="My Account" />
                    <DropdownLink
                      to="/account"
                      icon={<FaClipboardList />}
                      label="My Orders"
                    />
                    <DropdownLink
                      to="/account"
                      icon={<FaHeart />}
                      label="My Wishlist"
                    />
                    <DropdownLink to="/account" icon={<FaCog />} label="Settings" />

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center px-4 py-2 text-sm hover:bg-red-600"
                    >
                      <FaSignOutAlt className="mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Sign In / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden  flex items-center gap-3">
            <Link to="/cart" className="relative">
              <CartIcon />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 px-2 py-1 text-[10px] font-bold bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-800"
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800 px-4 py-3 space-y-2 animate-slideDown">
          <MobileNavLink
            to="/"
            label="Home"
            closeMenu={() => setIsMenuOpen(false)}
          />
          <MobileNavLink
            to="/packages"
            label="Packages"
            closeMenu={() => setIsMenuOpen(false)}
          />
          <MobileNavLink
            to="/custom-consultation"
            label="Custom Car Modification"
            closeMenu={() => setIsMenuOpen(false)}
          />
          <MobileNavLink
            to="/blog"
            label="Blog"
            closeMenu={() => setIsMenuOpen(false)}
          />
          <MobileNavLink
            to="/track-order"
            label="Track Order"
            closeMenu={() => setIsMenuOpen(false)}
          />

          {!user && (
            <MobileNavLink
              to="/register"
              label="Sign In / Register"
              closeMenu={() => setIsMenuOpen(false)}
            />
          )}

          {user && (
            <div className="pt-3 border-t border-gray-700 space-y-2">
              <MobileNavLink
                to="/account"
                label="Your Account"
                icon={<FaUser />}
                closeMenu={() => setIsMenuOpen(false)}
              />
              <MobileNavLink
                to="/account"
                label="Orders"
                icon={<FaClipboardList />}
                closeMenu={() => setIsMenuOpen(false)}
              />
              <MobileNavLink
                to="/account"
                label="Wishlist"
                icon={<FaHeart />}
                closeMenu={() => setIsMenuOpen(false)}
              />

              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-base hover:bg-red-600 rounded"
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

/* ------------------- Reusable Components ------------------- */

const NavLink = ({ to, label }) => (
  <Link to={to} className="hover:text-red-500">
    {label}
  </Link>
);

const DropdownLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-sm hover:bg-red-600"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Link>
);

const MobileNavLink = ({ to, label, icon, closeMenu }) => (
  <Link
    to={to}
    onClick={closeMenu}
    className="flex items-center px-3 py-2 bg-gray-900 rounded hover:bg-red-600 transition"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </Link>
);

const CartIcon = () => (
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
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293
        2.293c-.63.63-.184 1.707.707 1.707H17m0
        0a2 2 0 100 4 2 2 0 000-4zm-8
        2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Navbar;
