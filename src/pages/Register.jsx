import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";

const Register = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    loginEmail: "",
    loginPassword: "",
    rememberMe: false,
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeTerms: false,
  });

  const { storeTokenInLS, setUser, authError, setAuthError, fetchUser } =
    useAuth();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setErrors({});
    setGeneralError("");
    setSuccessMessage("");
  }, [activeTab]);

  useEffect(() => {
    if (authError) setAuthError(null);
  }, [authError, setAuthError]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (generalError) setGeneralError("");
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.loginEmail.trim()) newErrors.loginEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.loginEmail))
      newErrors.loginEmail = "Invalid email";
    if (!formData.loginPassword)
      newErrors.loginPassword = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "Please agree to terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsLoading(true);
    setGeneralError("");
    try {
      const { data } = await axios.post("/api/auth/login", {
        email: formData.loginEmail,
        password: formData.loginPassword,
      });
      storeTokenInLS(data.token);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setGeneralError(error.response?.data?.message || "Login failed.");
      setErrors({ loginEmail: "", loginPassword: "" });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setIsLoading(true);
    setGeneralError("");
    try {
      const { data } = await axios.post("/api/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        number: formData.phone,
      });
      console.log(data);
      storeTokenInLS(data.token);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setGeneralError(error.response?.data?.message || "Signup failed.");
      setErrors({ email: "", password: "", confirmPassword: "" });
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post("/api/otp/forgot-password", { email: forgotEmail });
      setSuccessMessage("OTP sent to your email.");
      setForgotStep("otp");
    } catch (error) {
      setGeneralError(error.response?.data?.error || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("/api/otp/verify-otp", {
        email: forgotEmail,
        otp: otpCode,
      });
      setSuccessMessage("OTP verified.");
      setForgotStep("reset");
    } catch (error) {
      setGeneralError(error.response?.data?.error || "Invalid OTP.");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post("/api/otp/reset-password", {
        email: forgotEmail,
        newPassword,
      });
      if (res.data.success) {
        setSuccessMessage("Password reset successful.");
        setForgotStep("email");
        setActiveTab("login");
      }
    } catch (error) {
      setGeneralError(error.response?.data?.error || "Reset failed.");
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12">
      <div className="max-w-md mx-auto bg-slate-950  rounded-xl shadow-md overflow-hidden md:max-w-[800px]">
        <div className="md:flex">
          <div className="md:shrink-0 hidden md:block">
            <img
              className="h-full w-96 object-cover"
              src='https://res.cloudinary.com/dbkyvye1k/image/upload/v1764677274/loginRegister_wqtjpl.jpg'
              alt="Flowers"
            />
          </div>
          <div className="p-8 w-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === tab
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "forgot") setForgotStep("email");
                  }}
                >
                  {tab === "login"
                    ? "Sign In"
                    : tab === "signup"
                    ? "Create Account"
                    : "Forgot Password"}
                </button>
              ))}
            </div>

            {/* Feedback Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-slate-800 text-green-700 rounded border border-green-200">
                {successMessage}
              </div>
            )}
            {generalError && (
              <div className="mb-4 p-3 bg-slate-800 text-red-700 rounded border border-red-200">
                {generalError}
              </div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    name="loginEmail"
                    type="email"
                    value={formData.loginEmail}
                    onChange={handleInputChange}
                    className={`  w-full border-none outline-none p-1 bg-slate-900 ${
                      errors.loginEmail ? "border-red-500" : ""
                    }`}
                  />
                  {errors.loginEmail && (
                    <p className="text-sm text-red-600">{errors.loginEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white ">
                    Password
                  </label>
                  <input
                    name="loginPassword"
                    type="password"
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    className={`w-full border-none outline-none p-1 bg-slate-900 ${
                      errors.loginPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.loginPassword && (
                    <p className="text-sm text-red-600">
                      {errors.loginPassword}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4  border-none outline-none p-1 bg-slate-900 rounded"
                    />
                    <label className="ml-2 block text-sm text-slate-500">
                      Remember me
                    </label>
                  </div>
                  {/* <button
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                    className="text-sm  hover:text-red-600"
                  >
                    Forgot password?
                  </button> */}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn p-2 rounded"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}

            {/* Forgot Password Tab */}
            {/* {activeTab === "forgot" && (
              <div className="space-y-4">
              
                <div>
                  <label className="block text-sm font-medium  mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="border-none outline-none p-2 p-1 bg-slate-900 w-full "
                    disabled={forgotStep !== "email"}
                  />
                  {forgotStep === "email" && (
                    <button
                      className="btn rounded p-2 w-full mt-2"
                      onClick={handleForgotPassword}
                    >
                      Send OTP
                    </button>
                  )}
                </div>

          
                {forgotStep !== "email" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="border-none outline-none p-2 p-1 bg-slate-900 w-full"
                      disabled={forgotStep === "reset"}
                    />
                    {forgotStep === "otp" && (
                      <button
                        className="btn rounded p-2 w-full mt-2"
                        onClick={handleVerifyOtp}
                      >
                        Verify OTP
                      </button>
                    )}
                  </div>
                )}

               
                {forgotStep === "reset" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-none outline-none p-2 p-1 bg-slate-900 w-full"
                    />
                    <button
                      className="btn rounded p-2 w-full mt-2"
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </button>
                  </div>
                )}
              </div>
            )} */}

            {/* Signup Form */}
            {/* Signup Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="string"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`mt-1 border-none outline-none p-2  bg-slate-900 w-full ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium "
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 border-none outline-none p-2  bg-slate-900 w-full ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`mt-1 border-none outline-none p-2  bg-slate-900 w-full ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`mt-1 border-none outline-none p-2  bg-slate-900 w-full ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`mt-1 border-none outline-none p-2  bg-slate-900 w-full ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className={`h-4 w-4 text-primary border-none outline-none p-2  bg-slate-900 rounded focus:ring-primary ${
                      errors.agreeTerms ? "border-red-500" : ""
                    }`}
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-2 block text-sm "
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:text-red-600">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:text-red-600">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.agreeTerms}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn rounded p-2 flex justify-center items-center"
                  >
                    {isLoading ? (
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                    ) : null}
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
