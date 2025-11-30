import { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import { Curve } from 'recharts';
 import axios from 'axios';

const PasswordSection = ({ onChangePassword }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Validate password
  const validatePassword = () => {
    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return false;
    }
    
    // Check password length
    if (formData.newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long', type: 'error' });
      return false;
    }
    
    return true;
  };
  
  // Handle form submission

const { token } = useAuth(); // Destructure token from auth context

const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage({ text: '', type: '' });

  if (!validatePassword()) return;

  setLoading(true);

  try {
    const response = await axios.put(
      '/api/users/password',
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage({
      text: response.data.message || 'Password changed successfully',
      type: 'success',
    });

    // Reset form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

  } catch (error) {
    console.error('Password change error:', error);
    setMessage({
      text:
        error.response?.data?.message ||
        'An error occurred. Please try again.',
      type: 'error',
    });
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Current Password</label>
          <div className="relative">
            <input
              type={showPassword.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border-none rounded focus:outline-none bg-slate-800 "
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2.5 text-gray-500"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPassword.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border-none rounded focus:outline-none bg-slate-800"
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute right-2 top-2.5 text-gray-500"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirm New Password</label>
          <div className="relative">
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border-none rounded focus:outline-none bg-slate-800"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2.5 text-gray-500"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="flex items-center px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Updating...
            </>
          ) : (
            <>
              <FaLock className="mr-2 " />
              Change Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PasswordSection; 