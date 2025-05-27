import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFilter } from "@/context/FilterContext";
import ListingsContainer from "@/components/ListingsContainer";
import SubCategoryMenu from "@/components/SubCategoryMenu";
import { updateSavedStatus } from "@/utils/listingUtils";
import { ListingType } from "@/types/listing";
import { api } from "@/lib/axois";

const Index = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { category, subCategory, searchQuery } = useFilter();
  const [listings, setListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locationString, radius } = useGeolocation();

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      // Add location parameters
      params.append('lat', '40.7128');  // Default to NYC coordinates
      params.append('lng', '-74.0060'); // You should use actual user location
      
      // Handle radius based on subcategory
      if (subCategory === 'Nearby') {
        params.append('radius', '10'); // Smaller radius for nearby
      } else {
        params.append('radius', String(radius || 20)); // Default or user-set radius
      }

      // Add filters
      if (category && category !== 'Home') {
        params.append('category', category.toUpperCase());
      }
      
      // Only add subcategory if it's not 'All' or 'Nearby'
      if (subCategory && !['All', 'Nearby'].includes(subCategory)) {
        params.append('sub_category', subCategory.toUpperCase());
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const { data } = await api.get(`/listings/nearby?${params.toString()}`);
      setListings(data.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, subCategory, searchQuery, radius]);

  return (
    <div className="w-full pb-0">
      {/* Show subcategory menu if a category is selected */}
      <SubCategoryMenu />

      {/* Main content with listings */}
      <div className="px-4 pt-2">
        <ListingsContainer
          listings={listings}
          isLoading={isLoading}
          searchQuery={searchQuery}
          activeFilter={subCategory || "All"}
          updateSavedStatus={(listings) => updateSavedStatus(listings, user?.id)}
          currentCategory={category}
        />
      </div>
    </div>
  );
};

export default Index;
