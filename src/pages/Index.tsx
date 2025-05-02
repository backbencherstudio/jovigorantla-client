import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import ListingsContainer from "@/components/ListingsContainer";
import FilterTabs from "@/components/FilterTabs";
import {
  generateMockListings,
  updateSavedStatus,
  getFilterTabs,
  getPageCategory,
} from "@/utils/listingUtils";
import { ListingType } from "@/types/listing";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Nearby");
  const [listings, setListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const currentPath = location.pathname;
  const { locationString, radius, updateRadius } = useGeolocation();

  // Get current category based on path
  const currentCategory = getPageCategory(currentPath);

  // Get filter tabs based on current category
  const filterTabs = getFilterTabs(currentCategory);

  useEffect(() => {
    // Get query param if it exists
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    } else {
      setSearchQuery("");
    }

    // Simulate loading data
    setIsLoading(true);

    // Generate listings based on current category
    setTimeout(() => {
      const mockData = generateMockListings(currentCategory, 50);
      setListings(updateSavedStatus(mockData, user?.id));

      // Set default filter based on category
      if (currentCategory === "Home") {
        setActiveFilter("Nearby");
      } else {
        setActiveFilter("All");
      }

      setIsLoading(false);
    }, 300);

    // Listen for changes in saved listings and location/radius
    const handleSavedListingsUpdate = () => {
      console.log("Saved listings updated event received in Index");
      setListings((prevListings) =>
        updateSavedStatus([...prevListings], user?.id)
      );
    };

    const handleLocationUpdate = () => {
      // Refresh listings when location or radius changes
      setIsLoading(true);
      setTimeout(() => {
        const mockData = generateMockListings(currentCategory, 50);
        setListings(updateSavedStatus(mockData, user?.id));
        setIsLoading(false);
      }, 300);
    };

    window.addEventListener("storage", handleSavedListingsUpdate);
    window.addEventListener("savedListingsUpdated", handleSavedListingsUpdate);
    window.addEventListener("locationUpdated", handleLocationUpdate);
    window.addEventListener("radiusUpdated", handleLocationUpdate);

    return () => {
      window.removeEventListener("storage", handleSavedListingsUpdate);
      window.removeEventListener(
        "savedListingsUpdated",
        handleSavedListingsUpdate
      );
      window.removeEventListener("locationUpdated", handleLocationUpdate);
      window.removeEventListener("radiusUpdated", handleLocationUpdate);
    };
  }, [currentCategory, user, searchParams, currentPath]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If search field is cleared, clear filters and show all listings
    if (!value.trim() && location.search.includes("q=")) {
      navigate(currentPath); // Navigate to the same page without query params

      // Refresh listings to show all results when search is cleared
      setIsLoading(true);
      setTimeout(() => {
        const mockData = generateMockListings(currentCategory, 50);
        setListings(updateSavedStatus(mockData, user?.id));
        setIsLoading(false);
      }, 300);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${currentPath}?q=${encodeURIComponent(searchQuery)}`);
    } else {
      // If empty search, show all listings and remove query params
      if (location.search) {
        navigate(currentPath);
      }
      // Refresh listings to show all results
      setIsLoading(true);
      setTimeout(() => {
        const mockData = generateMockListings(currentCategory, 50);
        setListings(updateSavedStatus(mockData, user?.id));
        setIsLoading(false);
      }, 300);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);

    // If filter is related to location, update the radius
    if (filter === "Nearby") {
      updateRadius(10).then(() => {
        window.dispatchEvent(new Event("radiusUpdated"));
      });
    } else if (filter === "USA") {
      updateRadius(30).then(() => {
        window.dispatchEvent(new Event("radiusUpdated"));
      });
    }
  };

  return (
    <div className="w-full pb-0">
      {/* Filter tabs */}
      <FilterTabs
        tabs={filterTabs}
        activeTab={activeFilter}
        onTabClick={handleFilterClick}
      />

      {/* Main content with listings */}
      <div className="px-4 pt-2">
        <ListingsContainer
          listings={listings}
          isLoading={isLoading}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          generateMockListings={generateMockListings}
          updateSavedStatus={(listings) =>
            updateSavedStatus(listings, user?.id)
          }
          currentCategory={currentCategory}
        />
      </div>
    </div>
  );
};

export default Index;
