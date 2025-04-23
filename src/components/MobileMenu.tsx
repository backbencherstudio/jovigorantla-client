
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Building2, Briefcase, Store, Car, LogOut, User, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const MobileMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Store, label: 'Marketplace', path: '/marketplace' },
    { icon: Car, label: 'Rides', path: '/rides' },
    { icon: Building2, label: 'Accommodations', path: '/accommodations' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      <div className="flex items-center p-4 border-b">
        <img src="/lovable-uploads/734bcb13-cbaa-4ead-b63a-d6fa46648627.png" alt="DesiEasy Logo" className="h-10 mr-2" />
      </div>

      <div className="p-4">
        {user ? (
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-lg font-semibold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900 truncate">
                {user.email}
              </p>
              <p className="text-sm text-gray-500 truncate">Member</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h3 className="font-medium text-gray-900">Not signed in</h3>
            <p className="text-sm text-gray-600 mb-3">Sign in to access all features</p>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-brand hover:bg-brand/90"
            >
              Sign in
            </Button>
          </div>
        )}

        <nav className="space-y-1 mb-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-brand' : 'text-gray-500'}`} />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <>
            <Separator className="my-2" />
            <div className="mt-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              <nav className="mt-2 space-y-1">
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors ${
                    location.pathname === '/profile'
                      ? 'bg-brand/10 text-brand'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className={`h-5 w-5 ${location.pathname === '/profile' ? 'text-brand' : 'text-gray-500'}`} />
                  <span className="ml-3">Profile</span>
                </Link>

                <Link
                  to="/about-us"
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors ${
                    location.pathname === '/about-us'
                      ? 'bg-brand/10 text-brand'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Info className={`h-5 w-5 ${location.pathname === '/about-us' ? 'text-brand' : 'text-gray-500'}`} />
                  <span className="ml-3">About Us</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-3 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 text-red-500" />
                  <span className="ml-3">Sign Out</span>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      <div className="mt-auto p-4 border-t border-gray-200 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} desi easy
      </div>
    </div>
  );
};

export default MobileMenu;
