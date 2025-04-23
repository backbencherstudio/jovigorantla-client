
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Store, Building2, Car, Briefcase } from 'lucide-react';

const CategoryIcons: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const categories = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Store, label: 'Marketplace', path: '/marketplace' },
    { icon: Car, label: 'Rides', path: '/rides' },
    { icon: Building2, label: 'Accommodations', path: '/accommodations' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  ];

  return (
    <div className="flex justify-between py-2">
      {categories.map((category) => {
        const isActive = location.pathname === category.path;
        const Icon = category.icon;
        
        return (
          <div 
            key={category.path}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => navigate(category.path)}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isActive ? 'bg-[#fbe1cb] text-brand' : 'bg-gray-100 text-gray-500'
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1 text-center">{category.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryIcons;
