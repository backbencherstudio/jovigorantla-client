import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ListingItem from "./ListingItem";
import NoListingsFound from "./NoListingsFound";
import LoadingSkeleton from "./LoadingSkeleton";
import ListingsGrid from "./ListingsGrid";
import AdCard from "./AdCard";
import { ListingType } from "@/types/listing";
import adService from "@/services/adService";
import listImg from "@/assets/listingimg.png";

interface ListingsContainerProps {
  listings: ListingType[];
  isLoading: boolean;
  searchQuery: string;
  activeFilter: string;
  generateMockListings: (category: string, count?: number) => ListingType[];
  updateSavedStatus: (listings: ListingType[]) => ListingType[];
  currentCategory: string;
}

const ListingsContainer = ({
  listings,
  isLoading,
  searchQuery,
  activeFilter,
  generateMockListings,
  updateSavedStatus,
  currentCategory,
}: ListingsContainerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [filteredListings, setFilteredListings] = useState<ListingType[]>([]);

  useEffect(() => {
    // Filter and sort listings
    if (!listings) {
      setFilteredListings([]);
      return;
    }

    const filtered = listings.filter((listing) => {
      // Filter by status
      const statusMatch =
        activeFilter === "All" ||
        listing.status === activeFilter ||
        (activeFilter === "Nearby" && listing.location.includes("Denton")) ||
        activeFilter === "USA";

      // Filter by search query
      const searchMatch =
        searchQuery === "" ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    });

    // Sort by freshness (newest first)
    const sorted = [...filtered].sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    setFilteredListings(sorted);
  }, [listings, searchQuery, activeFilter]);

  const handleListingClick = (id: string) => {
    navigate(`/listing/${id}`);
  };

  const toggleSaveListing = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to save listings", {
        description: "You need to be logged in to save listings",
      });
      navigate("/auth");
      return;
    }

    const updatedListings = listings.map((listing) => {
      if (listing.id === listingId) {
        return { ...listing, saved: !listing.saved };
      }
      return listing;
    });

    // Save to localStorage
    const savedListings = updatedListings
      .filter((listing) => listing.saved)
      .map((listing) => listing.id);

    localStorage.setItem(
      `savedListings_${user.id}`,
      JSON.stringify(savedListings)
    );
    console.log("Saved listings updated:", savedListings);

    // Dispatch event for real-time updates across components
    console.log("Dispatching savedListingsUpdated event");
    window.dispatchEvent(new Event("savedListingsUpdated"));

    const listing = listings.find((l) => l.id === listingId);
    if (listing) {
      const saved = !listing.saved;
      if (saved) {
        toast.success("Listing saved", {
          description: "The listing has been added to your Saved Listings",
        });
      } else {
        toast.success("Listing removed from saved", {
          description: "The listing has been removed from your Saved Listings",
        });
      }
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (filteredListings.length === 0) {
    return <NoListingsFound />;
  }

  return (
    <div className="space-y-4 overflow-visible">
      {filteredListings.map((listing, index) => (
        <div key={`listing-container-${listing.id}`}>
          <ListingItem
            key={listing.id}
            listing={listing}
            onToggleSave={toggleSaveListing}
          />
          {/* {index === 5 && (
            <img
              src={listImg}
              alt={listing.title}
              className=" h-32 object-cover rounded-2xl bg-orange-500 mt-4 w-full"
              onClick={() => handleListingClick(listing.id)}
            />
          )} */}

          {/* Insert ad card after every 15 listings */}
          {(index + 1) % 15 === 0 && index + 1 < filteredListings.length && (
            <div key={`ad-${index}`} className="mt-4 mb-4">
              {/* Get ad from ad service for current page */}
              {(() => {
                const ad = adService.getAdForPage(currentCategory, index + 1);
                if (ad) {
                  return <AdCard ad={ad} />;
                }
                return null;
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListingsContainer;
