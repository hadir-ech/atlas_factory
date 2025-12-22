import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <span>🏭</span>
            <span>Atlas SmartFactory</span>
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FiMenu size={24} />
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm">{user.firstName} {user.lastName}</span>
                <span className="text-xs bg-blue-700 px-2 py-1 rounded">{user.role}</span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user && (
              <>
                <div className="text-sm">{user.firstName} {user.lastName}</div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
