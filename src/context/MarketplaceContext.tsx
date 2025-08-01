import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { api } from "@/lib/axois";
import { useLocationContext } from "@/context/LocationContext";

interface MarketplaceContextProps {
  listings: any[];
  searchQuery: string;
  activeFilter: string;
  isLoading: boolean;
  hasMore: boolean;
  fetchListings: (filter: string, query: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: string) => void;
  handleHide: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextProps | undefined>(undefined);

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};

export const MarketplaceProvider: React.FC<{ children: ReactNode}> = ({ children }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { lat, lng, radius } = useLocationContext();

  const numberOfShownListings = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchListings = useCallback(async (filter: string, query: string) => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    const shownCount = numberOfShownListings.current;
    const sub_category = filter === "Services" ? "Service" : filter === "Items" ? "Item" : filter !== "All" ? filter : null;

    try {
      const { data: listingResponse } = await api.get("/listings/nearby", {
        params: {
          category: "MARKETPLACE",
          sub_category,
          search: query,
          limit: 10,
          numberOfShownListings: shownCount,
          lat: lat,
          lng: lng,
          radius: radius,
        },
      });

      const data = listingResponse.data;
      if (data.listings && data.listings.length > 0) {
        setListings((prevListings) => [
          ...prevListings,
          ...data.listings.filter((listing) => listing.type === "listing"),
        ]);
        numberOfShownListings.current += data.listings.filter((listing) => listing.type === "listing").length;
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [lat, lng, radius, hasMore]);

  const handleHide = (id: string) => {
    setListings(listings.filter((listing) => listing.id !== id));
  };

  useEffect(() => {
    fetchListings(activeFilter, searchQuery);
  }, [activeFilter, searchQuery, fetchListings]);

  return (
    <MarketplaceContext.Provider
      value={{
        listings,
        searchQuery,
        activeFilter,
        isLoading,
        hasMore,
        fetchListings,
        setSearchQuery,
        setActiveFilter,
        handleHide,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
