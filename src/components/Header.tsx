import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <Heart className="h-8 w-8 fill-current" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VolunteerConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Find Services
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/volunteers" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Connect
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <img 
                    src={user.profileImage} 
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                  />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Find Services
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Dashboard
                  </Link>
                  <Link to="/volunteers" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Connect
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-red-600 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}