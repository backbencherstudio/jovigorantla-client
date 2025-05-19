import { useState, useEffect, useRef, useCallback } from 'react';
import { ListingType } from '@/types/listing';
import { api } from '../lib/axois';

type Params = {
  lat: number;
  lng: number;
  radius: number;
  category?: string;
  sub_category?: string;
  search?: string;
  is_usa?: boolean;
};

export const useInfiniteListings = (params: Params) => {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursorDistance, setCursorDistance] = useState<number | null>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchListings = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
        const query = new URLSearchParams();

        query.append('lat', String(params.lat));
        query.append('lng', String(params.lng));
        query.append('radius', String(params.radius));
        
        if (params.category) query.append('category', params.category);
        if (params.sub_category) query.append('sub_category', params.sub_category);
        if (params.search) query.append('search', params.search);
        if (params.is_usa !== undefined) query.append('is_usa', String(params.is_usa));
        if (cursorDistance !== null) query.append('nextCursorDistance', String(cursorDistance));
        if (offset !== null) query.append('nextListingOffset', String(offset));

      const res = await api.get(`/listings/nearby?${query.toString()}`);
      const { data, hasNextPage, nextCursorDistance, nextListingOffset } = res.data;

      setListings((prev) => [...prev, ...data]);
      setHasMore(hasNextPage);
      setCursorDistance(nextCursorDistance);
      setOffset(nextListingOffset);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  }, [params, cursorDistance, offset, hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchListings();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchListings, hasMore, loading]);

  return { listings, loading, observerRef };
};
