import React from 'react';
import { useLocation } from 'react-router-dom';
import { useFilter, categoriesConfig, homeSubCategories } from '@/context/FilterContext';

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
    ? homeSubCategories // Use Nearby and USA for home page
    : (categoriesConfig[category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() as keyof typeof categoriesConfig] || []); // Other pages use their config with All tab

  // Handle subcategory click with proper case formatting
  const handleSubCategoryClick = (sub: string) => {
    // For special cases, pass as is
    if (['All', 'Nearby', 'USA'].includes(sub)) {
      setSubCategory(sub);
      return;
    }

    // For other subcategories, ensure proper case formatting
    // First letter capitalized, rest lowercase
    const formattedSubCategory = sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase();
    setSubCategory(formattedSubCategory);
  };

  // Function to display subcategory text
  const displaySubCategory = (sub: string) => {
    // For special cases, display as is
    if (['All', 'Nearby', 'USA'].includes(sub)) {
      return sub;
    }
    // For regular subcategories, display with first letter capital
    return sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase();
  };

  return (
    <div className="px-4 py-2 border-b">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => handleSubCategoryClick(sub)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              subCategory === displaySubCategory(sub)
                ? 'bg-gray-100 text-brand'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {displaySubCategory(sub)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubCategoryMenu; 