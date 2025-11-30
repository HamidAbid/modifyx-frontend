import { FaUser, FaClipboardList, FaHeart, FaLock, FaSignOutAlt } from 'react-icons/fa';

const UserSidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <FaUser /> },
    { id: 'orders', label: 'My Orders', icon: <FaClipboardList /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FaHeart /> },
    { id: 'password', label: 'Change Password', icon: <FaLock /> }
  ];
  
  return (
    <div className="bg-slate-900 rounded-lg shadow p-4 text-white">
      <h2 className="text-xl font-semibold mb-6 pb-2 border-b text-red-600">Account Menu</h2>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center p-3 rounded-md transition-colors ${
                  activeSection === item.id 
                    ? 'bg-slate-500 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
          
          <li className="mt-8">
            <button
              onClick={onLogout}
              className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <span className="mr-3"><FaSignOutAlt /></span>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar; 