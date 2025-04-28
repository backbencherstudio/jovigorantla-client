import { memo, useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Listing } from "@/utils/mockData";
import ListingCard from "./ListingCard";
import AdCard from "./AdCard";

interface ListingsGridProps {
  listings: Listing[];
  compact?: boolean;
}

// Define a type for our items that can be either a listing or an ad
type ListingOrAd =
  | { isAd: false; listing: Listing }
  | {
      isAd: true;
      adData: {
        id: string;
        name?: string;
        imageUrl: string;
        targetUrl: string;
        group?: string;
      };
    };

// Mock ads data - will be replaced with dynamic data from admin panel
const mockAds = [
  {
    id: "ad1",
    name: "Special Offer",
    imageUrl: "https://via.placeholder.com/600x400?text=Ad+1",
    targetUrl: "https://example.com/offer1",
  },
  {
    id: "ad2",
    name: "Limited Time Deal",
    imageUrl: "https://via.placeholder.com/600x400?text=Ad+2",
    targetUrl: "https://example.com/deal",
  },
  {
    id: "ad3",
    name: "New Service",
    imageUrl: "https://via.placeholder.com/600x400?text=Ad+3",
    targetUrl: "https://example.com/service",
  },
];

// Using memo to prevent unnecessary re-renders
const ListingsGrid = memo(
  ({ listings, compact = false }: ListingsGridProps) => {
    const [visibleItems, setVisibleItems] = useState<ListingOrAd[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const loaderRef = useRef<HTMLDivElement>(null);
    const ITEMS_PER_PAGE = 24; // Increased from 12 to 24 to show more items per page
    const AD_FREQUENCY = 15; // Show an ad after every 15 listing cards

    const loadMoreListings = useCallback(() => {
      if (loading) return;

      setLoading(true);

      // Simulate async loading
      setTimeout(() => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = page * ITEMS_PER_PAGE;
        const newListings = listings.slice(startIndex, endIndex);

        if (newListings.length > 0) {
          // Convert regular listings to format with isAd flag
          const regularListings = newListings.map((listing) => ({
            isAd: false as const,
            listing,
          }));

          // Insert ads after every AD_FREQUENCY listings
          const itemsWithAds = [...visibleItems];

          regularListings.forEach((listing, index) => {
            // Add the listing
            itemsWithAds.push(listing);

            // Insert an ad after every AD_FREQUENCY listings
            const totalRegularListings =
              visibleItems.filter((item) => !item.isAd).length + index + 1;

            if (totalRegularListings % AD_FREQUENCY === 0) {
              // Pick the next ad in rotation
              const adToInsert = {
                isAd: true as const,
                adData: mockAds[currentAdIndex],
              };

              itemsWithAds.push(adToInsert);

              // Update ad index for next rotation
              setCurrentAdIndex((currentAdIndex + 1) % mockAds.length);
            }
          });

          setVisibleItems(itemsWithAds);
          setPage((prev) => prev + 1);
        }

        setHasMore(endIndex < listings.length);
        setLoading(false);
      }, 500); // Small delay for better UX
    }, [page, listings, loading, visibleItems, currentAdIndex]);

    useEffect(() => {
      // Reset when listings change (e.g. filter applied)
      setVisibleItems([]);
      setPage(1);
      setHasMore(true);
      setCurrentAdIndex(0);

      // Load initial items
      loadMoreListings();
    }, [listings]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreListings();
          }
        },
        { threshold: 0.1 }
      );

      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }

      return () => {
        if (loaderRef.current) {
          observer.unobserve(loaderRef.current);
        }
      };
    }, [hasMore, loadMoreListings]);

    if (listings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No listings found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-1 max-w-md mx-auto">
          {visibleItems.map((item, index) => {
            // Explicit type guards to help TypeScript understand our union type
            if (item.isAd === true) {
              return (
                <div
                  key={`ad-${item.adData.id}-${index}`}
                  className="h-full w-full"
                >
                  <AdCard ad={item.adData} compact={compact} />
                </div>
              );
            } else {
              // At this point TypeScript knows item.isAd is false, so item.listing is accessible
              return (
                <div
                  key={`listing-${item.listing.id}`}
                  className="h-full w-full"
                >
                  <ListingCard listing={item.listing} compact={compact} />
                </div>
              );
            }
          })}
        </div>

        {(hasMore || loading) && (
          <div ref={loaderRef} className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Loading more listings...
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ListingsGrid.displayName = "ListingsGrid";

export default ListingsGrid;
