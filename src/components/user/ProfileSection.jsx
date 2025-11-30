import { useState } from 'react';
import { useAuth } from '../../context/authContext';

const ProfileSection = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        name: formData.name,
        email: formData.email
      };

      const result = await onUpdate(profileData);

      if (result.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false);
      } else {
        setMessage({ text: result.message || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setFormData({
        name: profile?.name || '',
        email: profile?.email || ''
      });
    }
    setIsEditing(!isEditing);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className=''>
      <div className="flex justify-between items-center mb-6 ">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        <button
          onClick={toggleEdit}
          className={`px-4 py-2 rounded btn`} 
          disabled={loading}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-slate-800 border-none focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-slate-800 border-none border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 btn rounded hover:bg-primary-dark"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <h3 className="text-sm text-red-500">Name</h3>
            <p className="font-medium">{profile?.name || 'Not set'}</p>
          </div>

          <div>
            <h3 className="text-sm text-red-500">Email</h3>
            <p className="font-medium">{profile?.email || 'Not set'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
