import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ListingItem from "./ListingItem";
import burger from "../assets/burger.jpg";
import NoListingsFound from "./NoListingsFound";
import LoadingSkeleton from "./LoadingSkeleton";
import ListingsGrid from "./ListingsGrid";
import AdCard from "./AdCard";
import { ListingType } from "@/types/listing";
import adService from "@/services/adService";
import listImg from "@/assets/listingImg.jpg";
import img1 from "@/assets/add.jpg";
import { api } from "@/lib/axois";

// interface ListingsContainerProps {
//   listings: unknown[]; // Use any[] for now, can be replaced with ListingType[]
//   isLoading: boolean;
//   searchQuery: string;
//   activeFilter: string;
//   // generateMockListings: (category: string, count?: number) => ListingType[];
//   updateSavedStatus: (listings: unknown[]) => unknown[];
//   currentCategory: string;
// }

const ListingsContainer = ({
  listings,
  isLoading,
  searchQuery,
  activeFilter,
  isUsa,
  // generateMockListings,
  updateSavedStatus,
  currentCategory,
}) => {
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
      // const statusMatch =
      //   activeFilter === "All" ||
      //   listing.sub_category === activeFilter ||
      //   (activeFilter === "Nearby" && listing.location.includes("Denton")) ||
      //   activeFilter === "USA";

      // // Filter by search query
      // const searchMatch =
      //   searchQuery === "" ||
      //   listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //   listing.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //   listing.location.toLowerCase().includes(searchQuery.toLowerCase());

      // return statusMatch && searchMatch;

      return true
    });

    // Sort by freshness (newest first)
    // const sorted = [...filtered].sort((a, b) => {
    //   return b.createdAt.getTime() - a.createdAt.getTime();
    // });

    setFilteredListings(filtered);
  }, [listings, searchQuery, activeFilter]);

  // const handleListingClick = (id: string) => {
  //   navigate(`/listing/${id}`);
  // };

  const handleAdClick = async (id: string, target_url: string) => {
    try {
      await api.post(`ads/${id}/track-click`)
      window.open(target_url, "_blank");
    } catch (error) {
      console.error("Error recording ad click:", error);
    }
  }

  const toggleSaveListing = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();

    // if (!user) {
    //   toast.error("Please sign in to save listings", {
    //     description: "You need to be logged in to save listings",
    //   });
    //   navigate("/auth");
    //   return;
    // }

    // const updatedListings = listings.map((listing) => {
    //   if (listing.id === listingId) {
    //     return { ...listing, saved: !listing.saved };
    //   }
    //   return listing;
    // });

    // // Save to localStorage
    // const savedListings = updatedListings
    //   .filter((listing) => listing.saved)
    //   .map((listing) => listing.id);

    // localStorage.setItem(
    //   `savedListings_${user.id}`,
    //   JSON.stringify(savedListings)
    // );
    // console.log("Saved listings updated:", savedListings);

    // // Dispatch event for real-time updates across components
    // console.log("Dispatching savedListingsUpdated event");
    // window.dispatchEvent(new Event("savedListingsUpdated"));

    // const listing = listings.find((l) => l.id === listingId);
    // if (listing) {
    //   const saved = !listing.saved;
    //   if (saved) {
    //     toast.success("Listing saved", {
    //       description: "The listing has been added to your Saved Listings",
    //     });
    //   } else {
    //     toast.success("Listing removed from saved", {
    //       description: "The listing has been removed from your Saved Listings",
    //     });
    //   }
    // }
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
        <div key={`listing-container-${listing.id + index}`}>
          {listing?.type === 'listing' && <ListingItem
            key={listing.id}
            listing={listing}
            onToggleSave={toggleSaveListing}
            isUsa={isUsa}
          />}

          {/* {
            listing?.type === 'ad' && <AdCard ad={{
              id: listing.id,
              image_url: listing?.image_url || '',
              target_url: listing.target_url || '',
              name: "test",
              group: listing?.ad_group_id,
            }} />
          } */}


          {listing?.type === 'ad' && (
            <a href={listing.target_url} target="_blank" className="w-full overflow-hidden" key={listing.id + index}>
              {/* This container maintains the aspect ratio and appearance across all devices */}
              <div
                className="relative w-full  max-w-full rounded-lg shadow-md bg-white cursor-pointer"
                style={{
                  aspectRatio: "574/300",
                  maxWidth: "574px",
                }}
                onClick={() => handleAdClick(listing.id, listing.target_url)}
              >
                {/* The actual banner image that maintains its exact appearance */}
                <img
                  src={listing.image_url || img1}
                  alt={listing.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            </a>
          )}

        </div>
      ))}
    </div>
  );
};

export default ListingsContainer;


// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { toast } from "sonner";
// import ListingItem from "./ListingItem";
// import NoListingsFound from "./NoListingsFound";
// import LoadingSkeleton from "./LoadingSkeleton";
// import AdCard from "./AdCard";
// import { ListingType } from "@/types/listing";
// import adService from "@/services/adService";
// import img1 from "@/assets/add.jpg";

// interface ListingsContainerProps {
//   listings: ListingType[];
//   isLoading: boolean;
//   searchQuery: string;
//   activeFilter: string;
//   generateMockListings: (category: string, count?: number) => ListingType[];
//   updateSavedStatus: (listings: ListingType[]) => ListingType[];
//   currentCategory: string;
// }

// const ListingsContainer = ({
//   listings,
//   isLoading,
//   searchQuery,
//   activeFilter,
//   generateMockListings,
//   updateSavedStatus,
//   currentCategory,
// }: ListingsContainerProps) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [filteredListings, setFilteredListings] = useState<ListingType[]>([]);

//   useEffect(() => {
//     if (!listings) return setFilteredListings([]);

//     const filtered = listings.filter((listing) => {
//       const statusMatch =
//         activeFilter === "All" ||
//         listing.status === activeFilter ||
//         (activeFilter === "Nearby" && listing.location.includes("Denton")) ||
//         activeFilter === "USA";

//       const searchMatch =
//         !searchQuery ||
//         listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         listing.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         listing.location.toLowerCase().includes(searchQuery.toLowerCase());

//       return statusMatch && searchMatch;
//     });

//     const sorted = filtered.sort(
//       (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
//     );

//     setFilteredListings(sorted);
//   }, [listings, searchQuery, activeFilter]);

//   const handleListingClick = (id: string) => {
//     navigate(`/listing/${id}`);
//   };

//   const toggleSaveListing = (e: React.MouseEvent, listingId: string) => {
//     e.stopPropagation();

//     if (!user) {
//       toast.error("Please sign in to save listings", {
//         description: "You need to be logged in to save listings",
//       });
//       navigate("/auth");
//       return;
//     }

//     const updatedListings = listings.map((listing) =>
//       listing.id === listingId ? { ...listing, saved: !listing.saved } : listing
//     );

//     const savedListings = updatedListings
//       .filter((listing) => listing.saved)
//       .map((listing) => listing.id);

//     localStorage.setItem(`savedListings_${user.id}`, JSON.stringify(savedListings));
//     window.dispatchEvent(new Event("savedListingsUpdated"));

//     const listing = listings.find((l) => l.id === listingId);
//     if (listing) {
//       const saved = !listing.saved;
//       toast.success(
//         saved ? "Listing saved" : "Listing removed from saved",
//         {
//           description: saved
//             ? "The listing has been added to your Saved Listings"
//             : "The listing has been removed from your Saved Listings",
//         }
//       );
//     }
//   };

//   if (isLoading) return <LoadingSkeleton />;
//   if (filteredListings.length === 0) return <NoListingsFound />;

//   return (
//     <div className="space-y-4 overflow-visible">
//       {filteredListings.map((listing, index) => (
//         <div key={`listing-container-${listing.id}`}>
//           <ListingItem
//             key={listing.id}
//             listing={listing}
//             onToggleSave={toggleSaveListing}
//           />

//           {index === 5 && (
//             <div className="w-full overflow-hidden">
//               <div
//                 className="relative w-full max-w-full rounded-lg shadow-md mt-4 bg-white"
//                 style={{ aspectRatio: "574/300", maxWidth: "574px" }}
//                 onClick={() => handleListingClick(listing.id)}
//               >
//                 <img
//                   src={img1}
//                   alt={listing.title}
//                   className="absolute inset-0 w-full h-full object-cover rounded-lg"
//                 />
//               </div>
//             </div>
//           )}

//           {(index + 1) % 15 === 0 && index + 1 < filteredListings.length && (
//             <div key={`ad-${index}`} className="mt-4 mb-4">
//               {(() => {
//                 const ad = adService.getAdForPage(currentCategory, index + 1);
//                 return ad ? <AdCard ad={ad} /> : null;
//               })()}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ListingsContainer;
