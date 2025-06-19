import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/axois';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';

// Types
export interface Location {
  lat: number;
  lng: number;
  address: string;
}

// Interface for incoming data that might use old field names
interface IncomingListingData {
  id?: string;
  title?: string;
  description?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  category?: string;
  sub_category?: string;
  is_usa?: boolean;
  post_to_usa?: boolean;
  user_id?: string;
  image_url?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  flagged_listing_status?: string;
  usa_listing_status?: string;
  slug?: string;
}

// Interface for the standardized listing data
export interface Listing {
  id?: string;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  category: string;
  sub_category: string;
  post_to_usa: boolean;
  user_id: string;
  image_url?: string;
  address: string;
  created_at?: string;
  updated_at?: string;
  flagged_listing_status?: string;
  usa_listing_status?: string;
  slug?: string;
}

interface ListingContextType {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  selectedLocation: Location | null;
  isUsa: boolean;
  hasMore: boolean;
  isInitialMount: React.RefObject<boolean>;

  fetchNearByListings: () => void;
  createListing: (formData: FormData) => Promise<void>;
  updateListing: (id: string, formData: FormData) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  fetchListings: () => Promise<void>;
  setSelectedLocation: (location: Location | null) => void;

  setCategory: (category: string | null) => void;
  setSubCategory: (sub: string | null) => void;
  setIsUsa: (isUsa: boolean) => void;
  hideListing: (id: string) => void;
  handleScroll: () => void;
  // setNumberOfShownListings: (number: number) => void;
  setSearchQuery: (query: string) => void;
  setListings: (listings: Listing[]) => void;

  // setListingCutoffTime: (time: string) => void;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider = ({ children }: { children: ReactNode }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [isUsa, setIsUsa] = useState<boolean>(false);

  const [hasMore, setHasMore] = useState(true);
  // const [numberOfShownListings, setNumberOfShownListings] = useState(0);
  // const [listingCutoffTime, setListingCutoffTime] = useState(""); // Initial cutoff time
  const numberOfShownListings = useRef(0);
  const listingCutoffTime = useRef("");
  const [searchQuery, setSearchQuery] = useState("");
  const isInitialMount = useRef(true);
  const navigate = useNavigate()


  const location = useLocation();


  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/listings');
      console.log('Fetching listings:', response.data);
      if (response.data.success) {
        setListings(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (formData: FormData) => {
    try {
      setLoading(true);

      // Convert latitude/longitude to lat/lng if they exist
      // const latitude = formData.get('latitude');
      // const longitude = formData.get('longitude');
      // if (latitude && longitude) {
      //   formData.delete('latitude');
      //   formData.delete('longitude');
      //   formData.append('lat', String(latitude));
      //   formData.append('lng', String(longitude));
      // }

      const response = await api.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        await fetchListings();
      }
    } catch (err) {
      setError('Failed to create listing');
      console.error('Error creating listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateListing = async (id: string, formData: FormData) => {
    try {
      setLoading(true);

      // Convert latitude/longitude to lat/lng if they exist
      const latitude = formData.get('latitude');
      const longitude = formData.get('longitude');
      if (latitude && longitude) {
        formData.delete('latitude');
        formData.delete('longitude');
        formData.append('lat', String(latitude));
        formData.append('lng', String(longitude));
      }

      const response = await api.patch(`/listings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        await fetchListings();
      }
    } catch (err) {
      setError('Failed to update listing');
      console.error('Error updating listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/listings/${id}`);

      if (response.data.success) {
        await fetchListings();
      }
    } catch (err) {
      setError('Failed to delete listing');
      console.error('Error deleting listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // hide listing function
  const hideListing = id => {
    const updatedListings = listings.filter(listing => listing.id !== id);
    setListings(updatedListings);
  }

  // Infinite scroll logic
  const handleScroll = () => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;

    console.log("bottom => ", bottom);

    if (bottom && hasMore) {
      fetchListings(); // Fetch more listings when scrolled to bottom
    }
  };

  const getParamsForUrl = () => {
    const params: Record<string, string | boolean> = {};
    if (subCategory === 'Services') params.sub_category = 'Service'; // Normalize subCategory
    else if (subCategory === 'Items') params.sub_category = 'Item'; // Normalize subCategory
    else if (subCategory) params.sub_category = subCategory;
    if (category) params.category = category;
    if (category == '/') params.category = ''
    console.log("category => ", category)
    if (isUsa) params.is_usa = isUsa;

    if (listingCutoffTime.current) params.listing_cutoff_time = listingCutoffTime.current;
    if (searchQuery) params.search_query = searchQuery;
    if (numberOfShownListings.current) params.numberOfShownListings = numberOfShownListings.current.toString();

    console.log("data => ", params);
    return params;
  }

  const fetchNearByListings = async () => {
    console.log("fetching nearby listings", !isInitialMount);
    if (loading || !isInitialMount) return; // Prevent fetching if already loading

    try {
      setLoading(true);

      const { data: listingResponse } = await api.get('/listings/nearby', {
        params: {
          ...getParamsForUrl(),
          limit: 7,
          lat: 40.7831,
          lng: -73.9712,
          radius: 100000000000000, // Default radius, can be adjusted
        },
      });
      const data = listingResponse.data;

      // console.log("data => ", data);

      if (data.listings && data.listings.length > 0) {
        setListings((prevListings) => [...prevListings, ...data.listings]); // Append new listings
        if (data.listing_cutoff_time && listingCutoffTime.current) {
          listingCutoffTime.current = data.listing_cutoff_time; // Set new cutoff time
          numberOfShownListings.current = data.numberOfShownListings
        }
        setHasMore(data.hasMore); // More listings available
      } else {
        setHasMore(false); // No more listings available
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   setListingCutoffTime("")
  //   setNumberOfShownListings(0)
  //   setListings([])
  //   fetchNearByListings();
  // }, [category, subCategory, isUsa])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      listingCutoffTime.current = ""
      numberOfShownListings.current = 0
      setListings([])
      fetchNearByListings();
    }, 100);

    console.log("fetching nearby listings", listingCutoffTime.current, numberOfShownListings.current,);
    listingCutoffTime.current = ""
    numberOfShownListings.current = 0
    setListings([])
    fetchNearByListings();
  }, [category, subCategory, isUsa]);

  // useEffect(() => {
  //   isInitialMount.current = false;
  //   fetchNearByListings();
  // }, [])





  // Expose to components
  // useEffect(() => {
  //   fetchNearByListings(); // Fetch initial listings on component mount
  // }, []);


  // useEffect(() => {
  //   console.log('ListingProvider mounted', category, subCategory, isUsa);
  //   const fetchData = async () => {

  //     try {
  //       setLoading(true);
  //       const response = await api.get('/listings/nearby', {
  //         params: {
  //           ...getParamsForUrl(),
  //           // is_usa: isUsa,
  //           lat: 40.7831,
  //           lng: -73.9712,
  //           radius: 100000000000000, // Default radius, can be adjusted
  //         },
  //       });
  //       console.log('Fetched listings:', response.data);
  //       if (response.data.success) {
  //         setListings(response.data.data.listings);
  //       }
  //     } catch (err) {
  //       setError('Failed to fetch listings');
  //       console.error('Error fetching listings:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, [category, subCategory, isUsa]);

  // useEffect(() => {
  //   if(!listings.length) {
  //     listingCutoffTime.current = ""
  //     numberOfShownListings.current = 0
  //   }
  // }, [listings])

  useEffect(() => {
    setListings([]);
    const currentPath = location.pathname;
    // navigate('/')
    if (currentPath.includes("/marketplace")) {
      setCategory("MARKETPLACE");
      setIsUsa(false);
      setSubCategory("");
    } else if (currentPath.includes("/rides")) {

      setCategory("RIDES");
      setIsUsa(false);
      setSubCategory("");

    } else if (currentPath.includes("/accommodations")) {
      setCategory("ACCOMMODATIONS");
      setIsUsa(false);
      setSubCategory("");

    } else if (currentPath.includes("/jobs")) {
      setCategory("JOBS");
      setIsUsa(false);
      setSubCategory("");

    } else {
      setCategory("");
      setIsUsa(false);
      setSubCategory("");
      setListings([]);
    }

    console.log('path => ', currentPath)
  }, [setCategory, setIsUsa, setSubCategory, location]);

  // useLayoutEffect(() => {
  //   const currentPath = location.pathname;
  //   if (currentPath.includes("/marketplace")) {
  //     setCategory("MARKETPLACE");
  //     setIsUsa(false);
  //     setSubCategory("");
  //   } else if (currentPath.includes("/rides")) {
  //     setCategory("RIDES");
  //     setIsUsa(false);
  //     setSubCategory("");
  //   } else if (currentPath.includes("/accommodations")) {
  //     setCategory("ACCOMMODATIONS");
  //     setIsUsa(false);
  //     setSubCategory("");
  //   } else if (currentPath.includes("/jobs")) {
  //     setCategory("JOBS");
  //     setIsUsa(false);
  //     setSubCategory("");
  //   } else {
  //     setCategory("");
  //     setIsUsa(false);
  //     setSubCategory("");
  //     setListings([]);
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log("isUsa => ", isUsa)
  // }, [isUsa])


  const value = {
    listings,
    loading,
    error,
    selectedLocation,
    isUsa,
    hasMore,
    isInitialMount,
    fetchNearByListings,
    createListing,
    updateListing,
    deleteListing,
    fetchListings,
    setSelectedLocation,
    setCategory,
    setSubCategory,
    setIsUsa,
    hideListing,
    handleScroll,
    setSearchQuery,
    setListings,
  };

  return (
    <ListingContext.Provider value={value}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListing = () => {
  const context = useContext(ListingContext);
  if (context === undefined) {
    throw new Error('useListing must be used within a ListingProvider');
  }
  return context;
};
