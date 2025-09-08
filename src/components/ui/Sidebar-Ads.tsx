import React, { useEffect, useState } from "react";
import { Card } from "./card";
import { Skeleton } from "./skeleton";
import { api } from "@/lib/axois";
import { Link } from "react-router-dom";

// Check if API was already called
let hasApiBeenCalled = false;
// Cache to store the ads data
let cachedAdsData: AdData[] | null = null;

interface AdBannerProps {
  position?: string;
  className?: string;
}
// Update the AdData interface to match the API response
interface AdData {
  id: string;
  name: string | null;
  image: string;
  image_url: string;
  active: boolean;
  add_type: string;
  target_url: string;
  clicks: number;
  views: number;
  created_at: string;
  updated_at: string;
}

const SidebarAds: React.FC<AdBannerProps> = ({ className }) => {
  // Initialize with cached data if available to prevent flash
  const [ads, setAds] = useState<AdData[]>(cachedAdsData || []);
  const [loading, setLoading] = useState(!hasApiBeenCalled || !cachedAdsData);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // If API was already called before, use cached data immediately
    if (hasApiBeenCalled && cachedAdsData) {
      setAds(cachedAdsData);
      setLoading(false);
      return;
    }

    const fetchAd = async () => {
      try {
        setLoading(true);
        const res = await api.get("/ads/sidebar");
        const data = res.data.data;
        setAds(data);
        cachedAdsData = data; // Cache the data
        hasApiBeenCalled = true; // Mark as called
      } catch (error) {
        console.error("Error fetching ads:", error);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, []);

  // ... loading state remains the same ...

  const handleClick = async (ad: AdData) => {
    try {
      await api.post(`/ads/sidebar/${ad.id}/track-click`);

      //window.open(ad.target_url, "_blank");

      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari) {
        window.location.href = ad.target_url;
      } else {
        // For other browsers, open in a new tab
        window.open(ad.target_url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setIsError(true);
    }
  };

  if (loading) {
    return (
      <div>
        <Card
          className={`overflow-hidden ${className} h-[260px] w-[230px] mx-auto bg-gray-50`}
        >
          <Skeleton className="h-full w-full" />
        </Card>
        <Card
          className={`overflow-hidden ${className} h-[260px] w-[230px] mx-auto bg-gray-50`}
        >
          <Skeleton className="h-full w-full" />
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Card
          className={`overflow-hidden ${className} h-[260px] w-[230px] mx-auto bg-gray-50 flex items-center justify-center`}
        >
          <div className="text-center p-6">
            <svg
              className="w-12 h-12 mx-auto text-yellow-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="text-yellow-600 font-medium mb-2">Connection Issue</p>
            <p className="text-gray-500 text-sm">
              Unable to load advertisement content
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Check your internet connection
            </p>
          </div>
        </Card>
        <Card
          className={`overflow-hidden ${className} h-[260px] w-[230px] mx-auto bg-gray-50 mt-4 flex items-center justify-center`}
        >
          <div className="text-center p-6">
            <svg
              className="w-12 h-12 mx-auto text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <p className="text-blue-600 font-medium mb-2">Refresh Required</p>
            <p className="text-gray-500 text-sm">Try refreshing the page</p>
            <p className="text-gray-400 text-xs mt-2">or come back later</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!ads?.length) {
    return null;
  }

  return (
    <div>
      {ads?.map((ad) =>
        ad.target_url ? (
          <Link to={ad.target_url} key={ad.id} target="_blank">
            <Card
              key={ad.id}
              className={`relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className} h-[250px] w-[230px] mx-auto mb-4`}
              onClick={() => handleClick(ad)}
            >
              <img
                src={ad.image_url}
                alt={ad.name || "Advertisement"}
                className="w-full h-full object-cover"
              />
              <span className="bg-[#474849a6] text-[10px] font-medium text-white px-2 py-1 rounded-[20px] absolute bottom-2 right-1">
                Sponsored
              </span>
            </Card>
          </Link>
        ) : (
          <Card
            key={ad.id}
            className={`relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className} h-[250px] w-[230px] mx-auto mb-4`}
          >
            <img
              src={ad.image_url}
              alt={ad.name || "Advertisement"}
              className="w-full h-full object-cover"
            />
            <span className="bg-[#474849a6] text-[10px] font-medium text-white px-2 py-1 rounded-[20px] absolute bottom-2 right-1">
              Sponsored
            </span>
          </Card>
        )
      )}
    </div>
  );
};

export default React.memo(SidebarAds);
