import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { motion } from "framer-motion";
import {
  FaLock,
  FaUser,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaMoon,
  FaSun,
  FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";
import axios from "axios";
const AdminLogin = () => {
  const { token, storeTokenInLS, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleApiInitialized, setGoogleApiInitialized] = useState(false);
  const [googleDriveAuthorized, setGoogleDriveAuthorized] = useState(false);

  const navigate = useNavigate();

  // Load Google API script
  useEffect(() => {
    const loadGoogleApi = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = initializeGoogleApi;
      document.body.appendChild(script);
    };

    loadGoogleApi();
  }, []);

  // Initialize Google API
  const initializeGoogleApi = () => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          apiKey: "YOUR_API_KEY", // Replace with your Google API key
          clientId: "YOUR_CLIENT_ID", // Replace with your Google Client ID
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
          scope: "https://www.googleapis.com/auth/drive.appdata",
        })
        .then(() => {
          setGoogleApiInitialized(true);
          if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
            setGoogleDriveAuthorized(true);
          }
        })
        .catch((error) => {
          console.error("Error initializing Google API", error);
        });
    });
  };

  // Handle Google Drive authentication
  const authenticateWithGoogleDrive = () => {
    if (!googleApiInitialized) return;

    window.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        setGoogleDriveAuthorized(true);
      })
      .catch((error) => {
        console.error("Error authenticating with Google Drive", error);
      });
  };

  // Save credentials to Google Drive
  const saveCredentialsToGoogleDrive = () => {
    if (!googleDriveAuthorized) return;

    const credentialsFile = new Blob(
      [JSON.stringify({ email, timestamp: new Date().toISOString() })],
      { type: "application/json" }
    );

    const metadata = {
      name: "flower_shop_admin_credentials.json",
      mimeType: "application/json",
      parents: ["appDataFolder"],
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", credentialsFile);

    const accessToken = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().access_token;

    fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Credentials saved to Google Drive", data);
      })
      .catch((error) => {
        console.error("Error saving credentials to Google Drive", error);
      });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      // Save token if needed
      console.log(data);
      await storeTokenInLS(data.token);
      // Set user in auth context
      await setUser(data.user);
      // Optionally save to Google Drive if needed
      if (rememberMe && googleDriveAuthorized) {
        saveCredentialsToGoogleDrive();
      }

      // Redirect to dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded-full ${
          darkMode ? "bg-gray-800 text-yellow-300" : "bg-white text-gray-800"
        } shadow-md`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-8 rounded-lg shadow-lg`}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Please log in to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
            <FaExclamationCircle className="mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaUser />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@flowershop.com"
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                    : "border border-gray-300 text-gray-700 focus:border-blue-500"
                }`}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
                    : "border border-gray-300 text-gray-700 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className={`ml-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Remember me
              </label>
            </div>

            <div>
            
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg bg-primary text-white font-medium flex items-center justify-center transition-colors ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary-dark"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Log in to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            For demo purposes: admin@flowershop.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
