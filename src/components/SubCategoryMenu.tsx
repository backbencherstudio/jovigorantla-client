import React from 'react';
import { useLocation } from 'react-router-dom';
import { useFilter, categoriesConfig } from '@/context/FilterContext';

const SubCategoryMenu = () => {
  const { category, subCategory, setSubCategory } = useFilter();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // If no category is selected and not on home page, don't show anything
  if (!category && !isHomePage) {
    return null;
  }

  // Get subcategories based on whether we're on home page or category page
  const subcategories = isHomePage 
    ? ["All", "Nearby"] // Only show All and Nearby on home page
    : (categoriesConfig[category as keyof typeof categoriesConfig] || []); // Other pages use their config with All tab

  return (
    <div className="px-4 py-2 border-b">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setSubCategory(sub)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              subCategory === sub
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubCategoryMenu; 