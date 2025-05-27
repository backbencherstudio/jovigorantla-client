import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Define the categories and their subcategories
export const categoriesConfig = {
  Marketplace: ["All", "Items", "Services"],
  Rides: ["All", "Available", "Looking"],
  Accommodations: ["All", "Available", "Looking"],
  Jobs: ["All", "Hiring", "Looking"],
};

interface FilterContextType {
  category: string;
  subCategory: string | null;
  searchQuery: string;
  setCategory: (category: string) => void;
  setSubCategory: (subCategory: string | null) => void;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [category, setCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isHomePage = location.pathname === '/';

  // Handle category selection
  const handleCategorySelect = (newCategory: string) => {
    setCategory(newCategory);
    setSubCategory(null); // Reset subcategory when category changes
    
    // Update URL based on category
    if (newCategory) {
      navigate(`/${newCategory.toLowerCase()}`);
    } else {
      navigate('/');
    }
  };

  // Handle subcategory selection
  const handleSubCategorySelect = (newSubCategory: string | null) => {
    setSubCategory(newSubCategory);
    
    if (!newSubCategory) {
      navigate(location.pathname);
      return;
    }

    // Special handling for home page
    if (isHomePage || location.pathname === '/') {
      navigate(`/home?subcategory=${newSubCategory.toLowerCase()}`);
      return;
    }
    
    // For other category pages
    if (category) {
      navigate(`/${category.toLowerCase()}?subcategory=${newSubCategory.toLowerCase()}`);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    if (query) {
      searchParams.set('q', query);
    } else {
      searchParams.delete('q');
    }
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setCategory('');
    setSubCategory(null);
    setSearchQuery('');
    navigate('/');
  };

  const value = {
    category,
    subCategory,
    searchQuery,
    setCategory: handleCategorySelect,
    setSubCategory: handleSubCategorySelect,
    setSearchQuery: setSearchQuery,
    handleSearch,
    clearFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}; 