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

type ListingType = {
  id: string;
  title: string;
  category: string;
  status: string;
  userName: string;
  postedTime: string;
  location: string;
  saved: boolean;
  createdAt: Date;
};

const SavedListings = () => {
  const { user, favoritesListings, deleteFavoritesListing } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>(favoritesListings);
  const [isLoading, setIsLoading] = useState(false);

  // Format time consistently as "2m ago", "2h ago", "2d ago"
  // const formatTime = (timeString: string | Date) => {
  //   if (timeString instanceof Date) {
  //     // Convert date to string format like "2h ago"
  //     const now = new Date();
  //     const diff = now.getTime() - timeString.getTime();
  //     const minutes = Math.floor(diff / 60000);
  //     const hours = Math.floor(minutes / 60);
  //     const days = Math.floor(hours / 24);

  //     if (days > 0) return `${days}d ago`;
  //     if (hours > 0) return `${hours}h ago`;
  //     if (minutes > 0) return `${minutes}m ago`;
  //     return "1m ago";
  //   }

  //   // Handle existing time strings
  //   // Convert timestrings like "1h ago", "2h ago" to consistent format
  //   if (timeString.match(/^\d+[mhd] ago$/)) return timeString;

  //   // Handle "X hours ago", "X minutes ago", etc.
  //   if (typeof timeString === "string") {
  //     if (timeString.includes("hour")) {
  //       return timeString.replace(/(\d+) hours? ago/, "$1h ago");
  //     }
  //     if (timeString.includes("minute")) {
  //       return timeString.replace(/(\d+) minutes? ago/, "$1m ago");
  //     }
  //     if (timeString.includes("day")) {
  //       return timeString.replace(/(\d+) days? ago/, "$1d ago");
  //     }

  //     // Handle special cases
  //     if (timeString === "yesterday") return "1d ago";
  //     if (timeString === "today") return new Date().getHours() + "h ago";
  //   }

  //   return String(timeString);
  // };

  console.log(favoritesListings)

  // Mock listings data - expanded for better test coverage
  const allMockListings = [
    {
      id: "1",
      title: "Looking for a private room in 2b2b near irving and coppell",
      category: "Accommodation",
      status: "Looking",
      userName: "Randy M",
      postedTime: "1h ago",
      location: "Denton, TX",
      saved: true,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      title: "Looking for a private room in 2b2b near irving",
      category: "Accommodation",
      status: "Available",
      userName: "Ramesh",
      postedTime: "2h ago",
      location: "Denton, TX",
      saved: true,
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      title: "Looking for a private room in 2b2b near irving and coppell",
      category: "Accommodation",
      status: "Available",
      userName: "Krishna",
      postedTime: "2h ago",
      location: "Lewisville, TX",
      saved: true,
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: "4",
      title: "Looking for a private room in 2b2b near irving and coppell",
      category: "Accommodation",
      status: "Available",
      userName: "Ravi Teja",
      postedTime: "3h ago",
      location: "Irving, TX",
      saved: true,
      createdAt: new Date(Date.now() - 10800000),
    },
    {
      id: "5",
      title: "iPhone 13 Pro for sale",
      category: "Marketplace",
      status: "Items",
      userName: "Sundar",
      postedTime: "4h ago",
      location: "Dallas, TX",
      saved: false,
      createdAt: new Date(Date.now() - 14400000),
    },
    {
      id: "6",
      title: "Daily ride share to downtown Dallas",
      category: "Rides",
      status: "Available",
      userName: "Lakshmi",
      postedTime: "5h ago",
      location: "Plano, TX",
      saved: false,
      createdAt: new Date(Date.now() - 18000000),
    },
  ];

  // Function to get updated saved listings
  // const getSavedListings = useCallback(async () => {
  //   if (!user) return [];

  //   // // Get saved listing IDs from localStorage
  //   // const savedListingsIds = JSON.parse(
  //   //   localStorage.getItem(`savedListings_${user.id}`) || "[]"
  //   // );

  //   const list = await api.get(`/favorites`);
  //   const savedListings = list.data.data;
  //   console.log(savedListings)

  //   // // Get all listings that match the saved IDs from our mock data
  //   // const savedListings = allMockListings.filter((listing) =>
  //   //   savedListingsIds.includes(listing.id)
  //   // );

  //   // Format time strings consistently
  //   return savedListings.map((listing) => ({
  //     ...listing,
  //     saved: true, // Ensure saved status is true for all saved listings
  //     postedTime: formatTime(listing.created_at),
  //   }));
  // }, [user]);


  // const formatCategory = (category: string) => {
  //   // Convert category to singular for display
  //   let displayCategory = category;
  //   if (category === "ACCOMMODATION") displayCategory = "Accommodation";
  //   if (category === "RIDES") displayCategory = "Ride";
  //   if (category === "JOBS") displayCategory = "Job";
  //   displayCategory = displayCategory.slice(0, 1).toUpperCase() + displayCategory.slice(1).toLowerCase();
  //   return displayCategory;
  // };

  // const formatSubCategory = (category: string, status: string) => {
  //  // For Marketplace, change the status to Item/Service
  //   let displayStatus = status;
  //   if (category === "Marketplace") {
  //     if (status === "Items") displayStatus = "Item";
  //     if (status === "Services") displayStatus = "Service";
  //   }
  //   displayStatus = displayStatus.slice(0, 1).toUpperCase() + displayStatus.slice(1).toLowerCase();
  //   return displayStatus;
  // }



 
  // Custom event listener for real-time updates
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }


    // const fetchSavedListings = async () => {
    //   setIsLoading(true);
    //   const currentSavedListings = await getSavedListings();
    //   setListings(currentSavedListings);
    //   setIsLoading(false);
    // };

    // fetchSavedListings();

    // Set up event listener for storage changes
    // const handleStorageChange = () => {
    //   console.log("Storage change detected in SavedListings");
    //   fetchSavedListings();
    // };

    // window.addEventListener("storage", handleStorageChange);

    // // Custom event for immediate updates within the same session
    // window.addEventListener("savedListingsUpdated", handleStorageChange);

    // Add direct visibility change handler to refresh on tab focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page became visible, refreshing saved listings");
        // fetchSavedListings();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      console.log("Removing saved listings event listeners");
      // window.removeEventListener("storage", handleStorageChange);
      // window.removeEventListener("savedListingsUpdated", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, navigate]);

  // useEffect(()=> {
  //   setIsLoading(false)
  //   setListings(favoritesListings)
  // }, [favoritesListings])

  const handleListingClick = (id: string) => {
    navigate(`/listing/${id}`);
  };

  const toggleSaveListing = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();

    // Remove the listing from the saved listings
    // const updatedListings = listings.filter(
    //   (listing) => listing.id !== listingId
    // );
    // setListings(updatedListings);

    await deleteFavoritesListing(listingId);


    // Update localStorage with the new list of saved listing IDs
    // const savedListingsIds = updatedListings.map((listing) => listing.id);
    // localStorage.setItem(
    //   `savedListings_${user.id}`,
    //   JSON.stringify(savedListingsIds)
    // );

    // Dispatch event for immediate updates
    // window.dispatchEvent(new Event("savedListingsUpdated"));

    
  };

  const handleListingAction = (
    e: React.MouseEvent,
    action: string,
    listingId: string
  ) => {
    e.stopPropagation();

    const listing = favoritesListings.find((l) => l.id === listingId);
    console.log("listing => ", listing)
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
          }
        break;
      case "hide":
        // toast.success(`Listing hidden: "${listing.title}"`);
        setListings(listings.filter((l) => l.id !== listingId));
        break;
      case "report":
        toast.success(`Listing reported: "${listing.title}"`);
        break;
      default:
        break;
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 py-5 w-full h-full bg-white">
      {isLoading ? (
        <div className="space-y-4 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {listings.length === 0 ? (
            <div className="bg-white p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No saved listings</h3>
              <p className="text-gray-500 mb-4">
                You haven't saved any listings yet.
              </p>
              <Button onClick={() => navigate("/")} variant="default">
                Browse Listings
              </Button>
            </div>
          ) : (
            <div className="space-y-4 thin-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto md:thin-scrollbar">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white  border-b border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleListingClick(listing.id)}
                >
                  <div className="pb-2 px-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                    <span>{formatCategory(listing.category)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatSubCategory(listing.category, listing.sub_category)}</span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {listing.title}
                    </h3>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{listing.user.name}</span>
                        <span className="mx-2">•</span>
                        <span>{formatTime(listing.created_at)}</span>
                        <span className="mx-2">•</span>
                        {/* <span>{listing.location}</span> */}
                        <span>Denton, TX</span>
                      </div>

                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => toggleSaveListing(e, listing.id)}
                        >
                          <Star className="h-5 w-5 fill-[#ff6b00] text-[#ff6b00]" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 ml-2"
                            >
                              <MoreVertical className="h-5 w-5 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) =>
                                handleListingAction(e, "share", listing.id)
                              }
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) =>
                                handleListingAction(e, "hide", listing.id)
                              }
                            >
                              <EyeOff className="h-4 w-4 mr-2" />
                              <span>Hide</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) =>
                                handleListingAction(e, "report", listing.id)
                              }
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              <span>Report</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedListings;
