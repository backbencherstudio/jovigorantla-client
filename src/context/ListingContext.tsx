import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '@/lib/axois';

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
  createListing: (formData: FormData) => Promise<void>;
  updateListing: (id: string, formData: FormData) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  fetchListings: () => Promise<void>;
  setSelectedLocation: (location: Location | null) => void;

  setCategory: (category: string | null) => void;
  setSubCategory: (sub: string | null) => void;
  setIsUsa: (isUsa: boolean) => void;
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
      const latitude = formData.get('latitude');
      const longitude = formData.get('longitude');
      if (latitude && longitude) {
        formData.delete('latitude');
        formData.delete('longitude');
        formData.append('lat', String(latitude));
        formData.append('lng', String(longitude));
      }

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

  const value = {
    listings,
    loading,
    error,
    selectedLocation,
    createListing,
    updateListing,
    deleteListing,
    fetchListings,
    setSelectedLocation,
    setCategory,
    setSubCategory,
    setIsUsa,
  };

  const getParamsForUrl = () => {
    const params: Record<string, string | boolean> = {};
    if (subCategory === 'Services') params.sub_category = 'Service'; // Normalize subCategory
    else if (subCategory === 'Items') params.sub_category = 'Item'; // Normalize subCategory
    else if (subCategory) params.sub_category = subCategory;


    if (category) params.category = category;
    if (isUsa) params.is_usa = isUsa;
    console.log("data => ", params);
    return params;
  }
  useEffect(() => {
    console.log('ListingProvider mounted', category, subCategory, isUsa);
    const fetchData = async () => {

      try {
        setLoading(true);
        const response = await api.get('/listings/nearby', {
          params: {
            ...getParamsForUrl(),
            // is_usa: isUsa,
            lat: 40.7831,
            lng: -73.9712,
            radius: 100, // Default radius, can be adjusted
          },
        });
        console.log('Fetched listings:', response.data);
        if (response.data.success) {
          setListings(response.data.data.listings);
        }
      } catch (err) {
        setError('Failed to fetch listings');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category, subCategory, isUsa]);



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
