import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/axois';
import { useGeolocation } from '@/hooks/useGeolocation';
import { ListingType } from '@/types/listing';
import debounce from 'lodash/debounce';

// Define the categories and their subcategories
export const categoriesConfig = {
  Marketplace: ["All", "Items", "Services"],
  Rides: ["All", "Available", "Looking"],
  Accommodations: ["All", "Available", "Looking"],
  Jobs: ["All", "Hiring", "Looking"],
};

// Define home page subcategories
export const homeSubCategories = ["Nearby", "USA"];

interface FilterContextType {
  category: string;
  subCategory: string | null;
  searchQuery: string;
  listings: ListingType[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
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
  const { locationString, radius } = useGeolocation();
  
  const [category, setCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursorDistance, setNextCursorDistance] = useState<number | null>(null);
  const [nextListingOffset, setNextListingOffset] = useState<number | null>(null);

  const isHomePage = location.pathname === '/';

  // Function to build API parameters
  const buildApiParams = (isLoadMore: boolean = false) => {
    const params = new URLSearchParams();

    // Add location parameters
    if (locationString) {
      const [lat, lng] = locationString.split(',');
      params.append('lat', lat || '40.7128');
      params.append('lng', lng || '-74.0060');
    } else {
      params.append('lat', '40.7128');
      params.append('lng', '-74.0060');
    }

    // Add radius
    params.append('radius', String(radius || 20));

    // Add category filter - ensure uppercase for API
    if (category && category !== 'Home') {
      params.append('category', category.toUpperCase());
    }

    // Add subcategory filter - capitalize first letter only
    if (subCategory && category && !['All', 'Nearby', 'USA'].includes(subCategory)) {
      const formattedSubCategory = subCategory.charAt(0).toUpperCase() + subCategory.slice(1).toLowerCase();
      params.append('sub_category', formattedSubCategory);
    }

    // Add USA filter if selected on home page
    if (isHomePage && subCategory === 'USA') {
      params.append('is_usa', 'true');
    }

    // Add search query
    if (searchQuery) {
      params.append('search', searchQuery);
    }

    // Add pagination parameters for load more
    if (isLoadMore && nextCursorDistance !== null) {
      params.append('nextCursorDistance', String(nextCursorDistance));
    }
    if (isLoadMore && nextListingOffset !== null) {
      params.append('nextListingOffset', String(nextListingOffset));
    }

    return params;
  };

  // Function to fetch listings with filters
  const fetchListings = async (isLoadMore: boolean = false) => {
    try {
      setIsLoading(true);
      const params = buildApiParams(isLoadMore);
      const apiUrl = `/listings/nearby?${params.toString()}`;
      console.log('API Request:', apiUrl);
      
      const { data } = await api.get(apiUrl);
      
      if (data && Array.isArray(data.data)) {
        if (isLoadMore) {
          setListings(prev => [...prev, ...data.data]);
        } else {
          setListings(data.data);
        }
        setHasMore(data.hasNextPage || false);
        setNextCursorDistance(data.nextCursorDistance || null);
        setNextListingOffset(data.nextListingOffset || null);
      } else {
        console.error('Invalid response format:', data);
        setListings([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more function for infinite scroll
  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    await fetchListings(true);
  };

  // Debounced version of fetchListings for search
  const debouncedFetchListings = debounce(() => fetchListings(false), 300);

  // Handle category selection
  const handleCategorySelect = (newCategory: string) => {
    // Store category in uppercase internally
    setCategory(newCategory.toUpperCase());
    setSubCategory('Nearby'); // Reset subcategory to "Nearby" when category changes to Home, otherwise "All"
    setSearchQuery(''); // Clear search query when category changes
    setNextCursorDistance(null); // Reset pagination
    setNextListingOffset(null);
    setHasMore(true);
    
    // Update URL based on category (keep URL in lowercase for readability)
    if (newCategory && newCategory !== 'Home') {
      navigate(`/${newCategory.toLowerCase()}`);
    } else {
      navigate('/');
    }
  };

  // Handle subcategory selection
  const handleSubCategorySelect = (newSubCategory: string | null) => {
    // Format subcategory with first letter capital if not null and not special case
    if (newSubCategory && !['All', 'Nearby', 'USA'].includes(newSubCategory)) {
      const formattedSubCategory = newSubCategory.charAt(0).toUpperCase() + newSubCategory.slice(1).toLowerCase();
      setSubCategory(formattedSubCategory);
    } else {
      setSubCategory(newSubCategory);
    }
    
    setNextCursorDistance(null); // Reset pagination
    setNextListingOffset(null);
    setHasMore(true);
    
    if (!newSubCategory) {
      navigate(location.pathname);
      return;
    }

    // Update URL with subcategory (keep URL in lowercase for readability)
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('subcategory', newSubCategory.toLowerCase());
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setNextCursorDistance(null); // Reset pagination
    setNextListingOffset(null);
    setHasMore(true);
    
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
    setListings([]);
    setNextCursorDistance(null);
    setNextListingOffset(null);
    setHasMore(true);
    navigate('/');
  };

  // Effect to fetch listings when filters change
  useEffect(() => {
    if (searchQuery) {
      debouncedFetchListings();
    } else {
      fetchListings(false);
    }
    
    return () => {
      debouncedFetchListings.cancel();
    };
  }, [category, subCategory, searchQuery, radius, locationString]);

  // Effect to sync URL params with state on mount and URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q');
    const subcategoryParam = searchParams.get('subcategory');

    // Set search query from URL
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }

    // Set subcategory from URL with proper formatting
    if (subcategoryParam && subcategoryParam !== subCategory?.toLowerCase()) {
      const formattedSubCategory = subcategoryParam.charAt(0).toUpperCase() + subcategoryParam.slice(1).toLowerCase();
      setSubCategory(formattedSubCategory);
    }

    // Set category from URL path with proper uppercase formatting
    const pathCategory = location.pathname.substring(1);
    if (pathCategory && pathCategory.toUpperCase() !== category) {
      const validCategory = Object.keys(categoriesConfig).find(
        cat => cat.toLowerCase() === pathCategory.toLowerCase()
      );
      if (validCategory) {
        setCategory(validCategory.toUpperCase());
      }
    }
  }, [location]);

  const value = {
    category,
    subCategory,
    searchQuery,
    listings,
    isLoading,
    hasMore,
    loadMore,
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