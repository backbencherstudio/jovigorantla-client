import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "@/lib/axois";
import { Search } from "lucide-react";
import CategoryIcons from "@/components/CategoryIcons";
import ListingItem from "@/components/ListingItem";
import { Input } from "@/components/ui/input";
import LocationWithRadius from "@/components/LocationWithRedius";
import FilterTabs from "@/components/FilterTabs";
import { useLocationContext } from "@/context/LocationContext";
import NoListingsFound from "@/components/NoListingsFound";
import { useIsMobile } from "@/hooks/use-mobile";
import ListingSkeleton from "@/components/ListingSkeleton";
import AllCaughtUp from "@/components/AllCaughtUp";

const useElementDistanceFromTop = (ref: React.RefObject<HTMLElement>) => {
  const [distanceFromTop, setDistanceFromTop] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const calculateDistance = () => {
      const rect = ref.current!.getBoundingClientRect();
      setDistanceFromTop(window.scrollY + rect.top);
    };

    // Calculate immediately
    calculateDistance();

    // Re-calculate on resize/scroll
    window.addEventListener("resize", calculateDistance);
    window.addEventListener("scroll", calculateDistance);

    return () => {
      window.removeEventListener("resize", calculateDistance);
      window.removeEventListener("scroll", calculateDistance);
    };
  }, [ref]);

  return distanceFromTop;
};

export default function AccommodationsLooking({ openModal }) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const filterTabsRef = useRef<HTMLDivElement>(null);

  const [isLoading, setLoading] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const numberOfShownListings = useRef(0);
  const listingCutoffTime = useRef("");
  const isFetchingRef = useRef(false);
  const [activeFilter, setActiveFilter] = useState("Looking");
  const [oldFilter, setOldFilter] = useState("");
  const { lat, lng, radius } = useLocationContext();
  const [isTabChanging, setIsTabChanging] = useState(false);

  // Add these new state variables for better tracking
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [filterOptions, setFilterOptions] = useState([
    "All",
    "Available",
    "Looking",
  ]);

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const isFirstLoadDone = useRef(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [autoSwitched, setAutoSwitched] = useState(false);
  const [locationChanged, setLocationChanged] = useState(false);

  const [isRestoringFromSession, setIsRestoringFromSession] = useState(() => {
    // Check for session data immediately on mount to prevent flash
    const cachedData = sessionStorage.getItem("home_cached_data");
    const savedScrollPosition = sessionStorage.getItem("home_scroll_position");
    return !!(cachedData && savedScrollPosition);
  });

  const distanceFromTop = useElementDistanceFromTop(filterTabsRef);
  const tabParam = searchParams.get("tab"); // returns "true" or null

  // If you want a boolean value
  const isTabActive = tabParam === "true";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (!value.trim()) {
      navigate(location.pathname);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    // console.log("Distance from top:", distanceFromTop, "px");
  }, [distanceFromTop]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      navigate(`${location.pathname}?query=${encodeURIComponent(trimmed)}`);
      setSearchQuery(trimmed);
    } else {
      navigate(location.pathname);
      setSearchQuery("");
    }
  };

  // Use useCallback to prevent unnecessary re-renders

  const currentActiveFilterRef = useRef(activeFilter);
  const currentSearchQueryRef = useRef(searchQuery);

  const fetchNearByListings = useCallback(
    async (filter: string, query: string, isNewFilter = false) => {
      // Update current active references
      currentActiveFilterRef.current = filter;
      currentSearchQueryRef.current = query;

      // Prevent multiple simultaneous requests
      if (isFetchingRef.current) {
        console.log("Already fetching, skipping request");
        return;
      }

      // Don't fetch if no more items and it's not a new filter
      if (!hasMore && !isNewFilter) {
        console.log("No more items to fetch");
        return;
      }

      isFetchingRef.current = true;
      // console.log('Starting fetch:', { filter, query, isNewFilter, numberOfShownListings: numberOfShownListings.current });

      try {
        setLoading(true);
        const shownCount = isNewFilter ? 0 : numberOfShownListings.current;

        // const sub_category = filter !== "All" ? filter : null;
        const sub_category = "Looking";

        const { data: listingResponse } = await api.get("/listings/nearby", {
          params: {
            category: "ACCOMMODATIONS",
            sub_category,
            search: query,
            limit: 20,
            numberOfShownListings: shownCount,
            lat: lat,
            lng: lng,
            radius: radius,
            listing_cutoff_time: isNewFilter
              ? undefined
              : listingCutoffTime.current,
          },
        });

        const data = listingResponse.data;

        if (
          filter !== currentActiveFilterRef.current ||
          query !== currentSearchQueryRef.current
        ) {
          // Ignoring response for outdated filter
          return;
        }

        // console.log("Fetch response:", {
        //   listingsCount: data.listings?.length || 0,
        //   hasMore: data.hasMore,
        //   totalCount: data.totalCount,
        //   numberOfShownListings: data.numberOfShownListings,
        // });

        if (data.listings && data.listings.length > 0) {
          if (isNewFilter || shownCount === 0) {
            // Reset for new filter or initial load
            setListings(data.listings);
            numberOfShownListings.current = data.listings.filter(
              (listing) => listing.type === "listing"
            ).length;
            setOldFilter(filter);
          } else {
            // Append to existing listings
            setListings((prev) => [...prev, ...data.listings]);
            numberOfShownListings.current += data.listings.filter(
              (listing) => listing.type === "listing"
            ).length;
          }

          setHasMore(data.hasMore);
          listingCutoffTime.current = data.listing_cutoff_time || "";
        } else {
          // No listings returned
          if (isNewFilter || shownCount === 0) {
            setListings([]);
            numberOfShownListings.current = 0;
          }
          setHasMore(false);

          if (!initialLoadDone && filter === "All" && !autoSwitched) {
            setAutoSwitched(true);
          }
        }

        if (!isFirstLoadDone.current) {
          isFirstLoadDone.current = true;
          /*   if (
            filter === "All" &&
            !isNearbyEmpty.current &&
            listings.length === 0
          ) {
            isNearbyEmpty.current = true;
          } */
        }
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        setHasMore(false); // Stop trying to fetch more on error
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
        setIsInitialLoad(false);

        // Reset location changed flag after handling
        if (locationChanged) {
          setLocationChanged(false);
        }
      }
    },
    [lat, lng, radius, hasMore]
  );

  const handleHide = (id: string) => {
    setListings(listings.filter((listing) => listing.id !== id));
  };

  // ================ New Code Start ============

  // Add session storage management
  const isReturningFromListing = useRef(false);

  // Check if we're returning from a listing page
  useEffect(() => {
    // Check if we have cached data
    const cachedData = sessionStorage.getItem("home_cached_data");
    const savedScrollPosition = sessionStorage.getItem("home_scroll_position");

    // Only restore from session storage if we have scroll position (indicating we came from a listing)
    if (cachedData && savedScrollPosition) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.listings && parsed.listings.length > 0) {
          // Show loader to hide the process
          setIsRestoringFromSession(true);

          // Restore cached data
          setListings(parsed.listings);
          setActiveFilter(parsed.activeFilter || "All");
          setSearchQuery(parsed.searchQuery || "");
          setSearchInput(parsed.searchQuery || "");
          setHasMore(parsed.hasMore !== undefined ? parsed.hasMore : true);
          numberOfShownListings.current = parsed.numberOfShownListings || 0;
          listingCutoffTime.current = parsed.listingCutoffTime || "";
          setFilterOptions(
            parsed.filterOptions || ["All", "Available", "Looking"]
          );
          setInitialLoadDone(parsed.initialLoadDone || false);
          setAutoSwitched(parsed.autoSwitched || false);

          // Mark as returning and set proper loading states
          isReturningFromListing.current = true;
          setIsInitialLoad(false);
          setInitialLoadComplete(true);

          // Clear cache
          sessionStorage.removeItem("home_cached_data");
        }
      } catch (error) {
        console.error("Error parsing cached data:", error);
        sessionStorage.removeItem("home_cached_data");

        setIsRestoringFromSession(false);
      }
    } else if (cachedData) {
      // Clear cache if no scroll position (not from listing page)
      sessionStorage.removeItem("home_cached_data");
    }

    // Restore scroll position if available
    if (savedScrollPosition) {
      const scrollY = parseInt(savedScrollPosition);
      console.log("Restoring scroll position from session storage:", scrollY);

      setTimeout(() => {
        window.scrollTo(0, scrollY);
        sessionStorage.removeItem("home_scroll_position");

        // Hide loader after scroll position is set with extra delay to prevent FilterTabs flash
        setTimeout(() => {
          setIsRestoringFromSession(false);
        }, 400);
      }, 100);
    }
  }, []);

  // Restore scroll position when returning from listing page
  useEffect(() => {
    if (location.state?.scrollY && isReturningFromListing.current) {
      console.log(
        "Restoring scroll position from location state:",
        location.state.scrollY
      );
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo(0, location.state.scrollY);
        isReturningFromListing.current = false;

        // Hide loader after scroll position is set with extra delay to prevent FilterTabs flash
        setTimeout(() => {
          setIsRestoringFromSession(false);
        }, 400);
      }, 100); // Delay for DOM load
    }
  }, [location.state, listings.length]);

  // Save data before navigating away
  useEffect(() => {
    const saveData = () => {
      if (listings.length > 0) {
        const dataToCache = {
          listings,
          activeFilter,
          searchQuery,
          hasMore,
          numberOfShownListings: numberOfShownListings.current,
          listingCutoffTime: listingCutoffTime.current,
          filterOptions,
          initialLoadDone,
          autoSwitched,
        };
        sessionStorage.setItem("home_cached_data", JSON.stringify(dataToCache));
      }
    };

    // Save on beforeunload
    const handleBeforeUnload = () => {
      saveData();
    };

    // Save on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveData();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Save periodically
    const interval = setInterval(saveData, 1000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
      // Save on unmount
      saveData();
    };
  }, [
    listings,
    activeFilter,
    searchQuery,
    hasMore,
    filterOptions,
    initialLoadDone,
    autoSwitched,
  ]);

  // =============== New Code End ================

  // Reset and fetch on filter/search/location change
  useEffect(() => {
    // Don't reset if we're returning from a listing page
    if (isReturningFromListing.current) {
      // Reset the flag after a short delay to allow proper initialization
      setTimeout(() => {
        isReturningFromListing.current = false;
      }, 100);
      return;
    }

    // console.log("Effect triggered:", {
    //   activeFilter,
    //   searchQuery,
    //   lat,
    //   lng,
    //   radius,
    // });

    // Reset the fetching flag to allow new requests
    isFetchingRef.current = false;

    // Reset state
    numberOfShownListings.current = 0;
    setListings([]);
    setHasMore(true);
    setIsInitialLoad(true);
    setLoading(true);

    // Fetch with new filter flag
    fetchNearByListings(activeFilter, searchQuery, true);
  }, [activeFilter, searchQuery, lat, lng, radius]);

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search).get("q") || "";
    setSearchQuery(queryParam);
    setSearchInput(queryParam);
  }, [location.search]);

  const handleFilterClick = (filter: string) => {
    // Get the current query parameters from the URL
    const currentParams = new URLSearchParams(location.search);

    // Set the 'tab' parameter to true (this will add it if it doesn't exist, or update it)
    currentParams.set("tab", "true");

    // Navigate to the same path but with the updated query parameters
    navigate(`${location.pathname}?${currentParams.toString()}`);

    //window.scrollTo(0, isMobile ? 200 : 0);
    window.scrollTo(0, 0);

    setIsTabChanging(true);
    setActiveFilter(filter);
    setTimeout(() => {
      setIsTabChanging(false);
    }, 500);
  };

  // Improved intersection observer with better cleanup
  useEffect(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const first = entries[0];
      // console.log('Intersection observed:', {
      //   isIntersecting: first.isIntersecting,
      //   hasMore,
      //   isLoading,
      //   isFetching: isFetchingRef.current,
      //   isTabChanging,
      //   isInitialLoad
      // });

      if (
        first.isIntersecting &&
        hasMore &&
        !isLoading &&
        !isFetchingRef.current &&
        !isTabChanging &&
        !isInitialLoad
      ) {
        console.log("Triggering load more");
        fetchNearByListings(activeFilter, searchQuery, false);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // Trigger when 10% visible instead of 100%
      rootMargin: "0px 0px 1000px 0px", // 50px
    });

    const currentElement = loadMoreRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    hasMore,
    isLoading,
    activeFilter,
    searchQuery,
    fetchNearByListings,
    isTabChanging,
    isInitialLoad,
  ]);

  // useEffect(() => {
  //   // Scroll to top on filter change
  //   // console.log(isTabActive)
  //   if (isTabActive && isMobile) {
  //     window.scrollTo(0, isMobile ? 200 : 0);
  //   }
  //   // window.scrollTo(0, isMobile ? 200 : 0);
  // });  // Only run once on mount

  useEffect(() => {
    if (isInitialLoad) {
      window.scrollTo(0, 0);
    }
  }, []);
  // Debug logging
  // useEffect(() => {
  //   console.log('State update:', {
  //     listings: listings.length,
  //     hasMore,
  //     isLoading,
  //     numberOfShownListings: numberOfShownListings.current,
  //     isTabChanging,
  //     isInitialLoad
  //   });
  // }, [listings.length, hasMore, isLoading, isTabChanging, isInitialLoad]);

  const yourTrackingFunction = async (listing: any) => {
    try {
      await api.post(`/ads/${listing.id}/track-click`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdClick = async (e: React.MouseEvent, listing: any) => {
    // Middle-click (wheel), right-click, or Ctrl/Cmd+click (open in new tab)
    if (e.ctrlKey || e.metaKey || e.button === 1 || e.button === 2) {
      console.log(e);
      // For new tab/window opens
      await yourTrackingFunction(listing);
      return; // Let default browser behavior proceed
    }

    // Regular left click
    e.preventDefault();
    await yourTrackingFunction(listing);

    // Programmatic navigation after tracking
    //window.open(listing.target_url, "_blank", "noopener,noreferrer");

    /* const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      window.location.href = listing.target_url;
    } else {
      // For other browsers, open in a new tab
      window.open(listing.target_url, "_blank", "noopener,noreferrer");
    } */
  };

  const tabsList = [
    {
      label: "All",
      url: "/accommodations",
    },
    {
      label: "Available",
      url: "/accommodations/available",
    },
    {
      label: "Looking",
      url: "/accommodations/looking",
    },
  ];

  return (
    // w-full mx-auto max-w-3xl bg-transparent min-h-[100vh] sm:h-auto bg-red-500
    <main
      className="w-full mx-auto max-w-3xl md:max-w-xl xl:max-w-3xl bg-transparent sm:h-auto"
      ref={filterTabsRef}
    >
      <FilterTabs
        tabs={filterOptions}
        activeTab={activeFilter}
        onTabClick={handleFilterClick}
        tabsList={tabsList}
      />

      {!isTabChanging ? (
        <>
          {/* Loader Skeleton For Content and Position of FilterTabs */}
          {isRestoringFromSession && (
            <div className="fixed inset-0 p-2 md:p-0 bg-white z-[61] flex items-center justify-center w-full max-w-3xl md:max-w-xl xl:max-w-3xl mx-auto">
              <div className="space-y-4 w-full h-full mt-[120px]">
                <div className="rounded-sm shadow-md flex items-center gap-2 p-4">
                  <div className="h-8 bg-gray-200 w-[60px] rounded-full"></div>
                  <div className="h-8 bg-gray-200 w-[60px] rounded-full"></div>
                  <div className="h-8 bg-gray-200 w-[60px] rounded-full"></div>
                </div>

                <div className="space-y-2 rounded-lg shadow-md p-4">
                  <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                </div>
                <div className="space-y-2  rounded-lg shadow-md p-4">
                  <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                  <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                </div>
              </div>
            </div>
          )}
          {/*  px-4 -- only it was before */}
          <div className="pb-5 lg:pb-0 px-4 md:px-0 my-4 md:mx-2 space-y-4">
            {listings.map((listing, index) => (
              <div key={`${listing.id}-${index}`}>
                {listing?.type === "listing" && (
                  <ListingItem
                    listing={listing}
                    onToggleSave={() => {}}
                    isUsa={false}
                    onHide={() => handleHide(listing.id)}
                    openModal={openModal}
                  />
                )}
                {listing?.type === "ad" &&
                  (listing.target_url ? (
                    <Link
                      to={listing.target_url}
                      target="_blank"
                      className="block"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default anchor click behavior
                        window.open(listing.target_url, "_blank"); // Open in a new tab
                        handleAdClick(e, listing); // Your custom tracking
                      }}
                      onAuxClick={(e) => {
                        e.preventDefault(); // Prevent default behavior for middle mouse button
                        window.open(listing.target_url, "_blank");
                        handleAdClick(e, listing);
                      }}
                      /*  onClick={(e) => handleAdClick(e, listing)}
                      onAuxClick={(e) => handleAdClick(e, listing)} // Catches middle mouse button */
                      // onContextMenu={() => yourTrackingFunction(listing)} // Right click menu
                    >
                      <div
                        className="relative w-full max-w-full rounded-lg shadow-md bg-white cursor-pointer"
                        style={{ aspectRatio: "574/300", maxWidth: "100%" }}
                      >
                        <img
                          src={listing.image_url}
                          alt={listing.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                        <span className="bg-[#474849a6] text-xs font-medium text-white px-2 py-1 rounded-[20px] absolute bottom-2 right-1">
                          Sponsored
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className="relative w-full max-w-full rounded-lg shadow-md bg-white cursor-pointer"
                      style={{ aspectRatio: "574/300", maxWidth: "100%" }}
                    >
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                      <span className="bg-[#474849a6] text-xs font-medium text-white px-2 py-1 rounded-[20px] absolute bottom-2 right-1">
                        Sponsored
                      </span>
                    </div>
                  ))}
              </div>
            ))}

            {hasMore && (
              <div
                ref={loadMoreRef}
                className="w-full flex justify-center py-6 text-gray-400 text-sm"
              >
                {isLoading ? "Loading more..." : "Scroll for more..."}
              </div>
            )}

            {!hasMore && listings.length > 0 && <AllCaughtUp />}
            {!hasMore && listings.length === 0 && <NoListingsFound />}

            {/* Debug info - remove in production */}
            {/* <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
            Debug: Listings: {listings.length}, HasMore: {hasMore.toString()}, Loading: {isLoading.toString()}, 
            Shown: {numberOfShownListings.current}, TabChanging: {isTabChanging.toString()}
          </div> */}
          </div>
        </>
      ) : (
        <ListingSkeleton />
      )}
    </main>
  );
}
