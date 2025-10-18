import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, MoreVertical, Share2, EyeOff, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axois";
import { formatTime } from "@/lib/utils";
import { formatCategory, formatSubCategory } from "@/lib/format";
import ListingActions from "@/components/ListingActions";
import AboutFooter from "./AboutFooter";
import usStates from "@/data/states";

const SavedListings = () => {
  const {
    user,
    favoritesListings,
    deleteFavoritesListing,
    fetchFavoritesListings,
  } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  //console.log("favoritesListings from context:", favoritesListings);

  // Fetch saved listings from API
  const fetchSavedListings = useCallback(async () => {
    if (!user) return;

    try {
      //setIsLoading(true);

      // If fetchFavoritesListings exists in context, use it
      if (fetchFavoritesListings) {
        // await fetchFavoritesListings();
      } else {
        // Otherwise fetch directly
        // const response = await api.get("/favorites");
        // const savedListings = response.data.data || [];
        // setListings(savedListings);
      }
    } catch (error) {
      console.error("Error fetching saved listings:", error);
      toast.error("Failed to load saved listings");
    } finally {
      //setIsLoading(false);
      setIsInitialized(true);
    }
  }, [user, fetchFavoritesListings]);

  // Initialize component
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    //If favoritesListings is already populated, use it
    if (favoritesListings && favoritesListings.length > 0) {
      setListings(favoritesListings);
      //setIsLoading(false);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // If favoritesListings is empty and we haven't initialized, fetch from API
      fetchSavedListings();
    }
  }, [user, navigate, favoritesListings, isInitialized, fetchSavedListings]);

  // Update listings when favoritesListings changes
  useEffect(() => {
    if (favoritesListings && favoritesListings.length > 0) {
      setListings(favoritesListings);

      //setIsLoading(false);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else if (
      isInitialized &&
      favoritesListings &&
      favoritesListings.length === 0
    ) {
      // If initialized and favoritesListings is explicitly empty array
      setListings([]);

      //setIsLoading(false);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [favoritesListings, isInitialized]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        console.log("Page became visible, refreshing saved listings");
        //fetchSavedListings();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSavedListings, user]);

  const handleListingClick = (id) => {
    navigate(`/listing/${id}`);
  };

  const toggleSaveListing = async (e, listingId) => {
    e.stopPropagation();
    try {
      await deleteFavoritesListing(listingId);
      setListings(listings.filter((l) => l.id !== listingId));
      toast.success("Listing removed from saved");
    } catch (error) {
      console.error("Error removing listing:", error);
      toast.error("Failed to remove listing");
    }
  };

  const handleListingAction = (e, action, listingId) => {
    e.stopPropagation();

    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    switch (action) {
      case "share":
        if (navigator.share) {
          navigator.share({
            title: listing.title,
            text: `Check out this listing: ${listing.title}`,
            url: `${window.location.origin}/listing/${listingId}`,
          });
        } else {
          navigator.clipboard.writeText(
            `${window.location.origin}/listing/${listingId}`
          );
          toast.success("Link copied to clipboard");
        }
        break;
      case "hide":
        setListings(listings.filter((l) => l.id !== listingId));
        toast.success("Listing hidden");
        break;
      case "report":
        toast.success(`Listing reported: "${listing.title}"`);
        break;
      default:
        break;
    }
  };

  // Redirect if no user
  if (!user) return null;

  return (
    // h-full
    <div className="p-2 py-4 pb-0 lg:pb-0 w-full min-h-[calc(100vh-110px)]  bg-white flex flex-col justify-between gap-4">
      {isLoading ? (
        <>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {listings.length === 0 ? (
            <div className="bg-white p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No saved listings</h3>
              <p className="text-gray-500 mb-4">
                You haven't saved any listings yet.
              </p>
              <Button
                onClick={() => {
                  sessionStorage.removeItem("home_cached_data");
                  sessionStorage.removeItem("home_scroll_position");
                  navigate("/");
                  scrollTo(0, 0);
                }}
                variant="default"
              >
                Browse Listings
              </Button>
            </div>
          ) : (
            <div className="space-y-4 ">
              {listings.map((listing) => {
                const [city, stateAbbr] =
                  listing.address?.split(",").map((part) => part.trim()) || [];

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-lg border-b border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleListingClick(listing.id)}
                  >
                    <div className="py-4 px-4">
                      <div className="flex justify-between">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <span>{formatCategory(listing.category)}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {formatSubCategory(
                              listing.category,
                              listing.sub_category
                            )}
                          </span>
                        </div>

                        <ListingActions
                          listingId={listing.id}
                          listingTitle={listing.title}
                          isUsa={false}
                          onToggleSave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSaveListing(e, listing.id);
                          }}
                          onHide={() =>
                            handleListingAction(null, "hide", listing.id)
                          }
                          openModal={() =>
                            handleListingAction(null, "report", listing.id)
                          }
                        />
                      </div>

                      <h3 className="text-lg font-medium text-gray-900">
                        {listing.title}
                      </h3>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{listing?.user?.name?.slice(0, 15)}</span>
                          <span className="mx-2">•</span>
                          <span>{formatTime(listing.created_at)}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {/*  {listing.address
                              ?.split(",")
                              .filter((_, i) => i === 0 || i === 1)
                              .join(", ")} */}

                            {city +
                              ", " +
                              (usStates[stateAbbr.toLocaleLowerCase()] ||
                                stateAbbr)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {/* About Footer */}
      <div className="mt-4">
        <AboutFooter />
      </div>
    </div>
  );
};

export default SavedListings;
