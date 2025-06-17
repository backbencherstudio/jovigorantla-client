import { useState, useEffect, useRef } from "react";
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
import { api } from "@/lib/axois";
import { useListing } from "@/context/ListingContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  // const currentCategory = getPageCategory(location.pathname);
  // const initialFilter = currentCategory === "Home" ? "Nearby" : "All";
  // const [activeFilter, setActiveFilter] = useState(initialFilter);

  // const [activeFilter, setActiveFilter] = useState("Nearby");
  // const [listings, setListings] = useState<ListingType[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const { isUsa, setIsUsa, setSubCategory, loading, listings, handleScroll, hasMore, fetchNearByListings } = useListing();

  const location = useLocation();
  const currentPath = location.pathname;

  const initialFilter = currentPath === "/" ? "Nearby" : "All";

  // console.log("Current path:", currentPath);
  // console.log("Initial filter:", initialFilter);
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const { locationString, radius, updateRadius } = useGeolocation();
  const loadingRef = useRef(null); // Reference to the loading element

  // Get current category based on path
  const currentCategory = getPageCategory(currentPath);


  // Get filter tabs based on current category
  const filterTabs = getFilterTabs(currentCategory);

  // useEffect(() => {
  //   const defaultFilter = currentPath === "/" ? "Nearby" : "All";
  //   setSubCategory('');
  //   setActiveFilter(defaultFilter);
  // }, [currentPath, setSubCategory]);

  useEffect(() => {
    const subParam = searchParams.get("sub");

    if (subParam) {
      setSubCategory(subParam);
      setActiveFilter(subParam); // Optional: reflect in UI tab
    } else {
      setSubCategory('');
      setActiveFilter(currentPath === "/" ? "Nearby" : "All");
    }
  }, [searchParams, currentPath, setSubCategory]);




  useEffect(() => {
    // Get query param if it exists
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    } else {
      setSearchQuery("");
    }

    // Simulate loading data
    // setIsLoading(true);

    // // Generate listings based on current category
    // setTimeout(() => {
    //   const mockData = generateMockListings(currentCategory, 50);
    //   setListings(updateSavedStatus(mockData, user?.id));

    //   // Set default filter based on category
    //   if (currentCategory === "Home") {
    //     setActiveFilter("Nearby");
    //   } else {
    //     setActiveFilter("All");
    //   }

    //   setIsLoading(false);
    // }, 300);

    // Listen for changes in saved listings and location/radius
    const handleSavedListingsUpdate = () => {
      console.log("Saved listings updated event received in Index");
      // setListings((prevListings) =>
      //   updateSavedStatus([...prevListings], user?.id)
      // );
    };

    const handleLocationUpdate = () => {
      // Refresh listings when location or radius changes
      // setIsLoading(true);
      // setTimeout(() => {
      //   const mockData = generateMockListings(currentCategory, 50);
      //   setListings(updateSavedStatus(mockData, user?.id));
      //   setIsLoading(false);
      // }, 300);
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
    // if (!value.trim() && location.search.includes("q=")) {
    //   navigate(currentPath); // Navigate to the same page without query params

    //   // Refresh listings to show all results when search is cleared
    //   setIsLoading(true);
    //   setTimeout(() => {
    //     const mockData = generateMockListings(currentCategory, 50);
    //     setListings(updateSavedStatus(mockData, user?.id));
    //     setIsLoading(false);
    //   }, 300);
    // }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (searchQuery.trim()) {
    //   navigate(`${currentPath}?q=${encodeURIComponent(searchQuery)}`);
    // } else {
    //   // If empty search, show all listings and remove query params
    //   if (location.search) {
    //     navigate(currentPath);
    //   }
    //   // Refresh listings to show all results
    //   setIsLoading(true);
    //   setTimeout(() => {
    //     const mockData = generateMockListings(currentCategory, 50);
    //     setListings(updateSavedStatus(mockData, user?.id));
    //     setIsLoading(false);
    //   }, 300);
    // }
  };


  // const handleFilterClick = (filter: string) => {
  //   setActiveFilter(filter);

  //   if (filter === 'USA') {
  //     setSubCategory('')
  //     setIsUsa(true);
  //   } else {
  //     if (filter === 'All') {
  //       setSubCategory('');
  //     } else if (filter !== 'Nearby') {
  //       setSubCategory(filter);
  //     }
  //     setIsUsa(false);
  //   }




  //   // If filter is related to location, update the radius
  //   // if (filter === "Nearby") {
  //   //   updateRadius(10).then(() => {
  //   //     window.dispatchEvent(new Event("radiusUpdated"));
  //   //   });
  //   // } else if (filter === "USA") {
  //   //   updateRadius(30).then(() => {
  //   //     window.dispatchEvent(new Event("radiusUpdated"));
  //   //   });
  //   // }
  // };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);

    if (filter === 'USA') {
      setSubCategory('');
      searchParams.delete('sub'); // Remove subcategory if going to USA
      setIsUsa(true);
    } else {
      setIsUsa(false);

      if (filter === 'All' || filter === 'Nearby') {
        setSubCategory('');
        searchParams.delete('sub');
      } else {
        setSubCategory(filter);
        searchParams.set('sub', filter); // ✅ Store subCategory in URL
      }
    }

    setSearchParams(searchParams); // ✅ Update the URL
  };

  // const fetchListings = async () => {
  //   try {
  //     setIsLoading(true);
  //     const { data } = await api.get(`/listings/nearby?lat=40.7128&lng=-74.0060&radius=20`);
  //     console.log(data);

  //     setListings(data.data);
  //   } catch (error) {
  //     console.error("Error fetching listings:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchListings();
  // }, [])

  // Infinite scroll logic
  // useEffect(() => {
  //   // Listen for scroll event
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [hasMore]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && hasMore && !loading) {
              console.log("Loading element is in view. Fetching more listings...");
              fetchNearByListings(); // Fetch more listings when the loading element is in view
            }
          });
        },
        {
          rootMargin: "100px", // Trigger when the loading element is 100px from the bottom
          threshold: 1.0, // Ensure that the entire element is in view before triggering
        }
      );
  
      if (loadingRef.current) {
        observer.observe(loadingRef.current); // Start observing the loading element
      }
  
      return () => {
        if (loadingRef.current) {
          observer.unobserve(loadingRef.current); // Clean up observer on unmount
        }
      };
    }, [hasMore, loading]);
  
    // useEffect(() => {
    //   fetchNearByListings(); // Fetch initial listings on mount
    // }, []);

  // useEffect(() => {
  //   // Fetch initial listings on mount
  //   // fetchNearByListings();
  // }, []);


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
          isLoading={loading}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          isUsa={isUsa}
          // generateMockListings={generateMockListings}
          updateSavedStatus={(listings) =>
            updateSavedStatus(listings, user?.id)
          }
          currentCategory={currentCategory}
        />
          <div ref={loadingRef} style={{ height: '50px'}}>
        {/* This element will trigger the observer when in view */}
      </div>
      </div>
    </div>
  );
};

export default Index;
