import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload } from "lucide-react";

interface AdBannerProps {
  position: string;
  className?: string;
}

interface AdData {
  id: string;
  name: string;
  image: string | null;
  active: boolean;
  position: string;
  clicks: number;
}

const AdBanner: React.FC<AdBannerProps> = ({ position, className }) => {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching ad data
    const fetchAd = () => {
      setLoading(true);

      // Mock data - in a real app, this would be fetched from your backend
      // Now using null for image to show the placeholder state
      const mockAds = [
        {
          id: "1",
          name: "Top Banner Ad Slot",
          image: null, // Set to null to show the placeholder
          active: true,
          position: "right_top",
          clicks: 245,
        },
        {
          id: "2",
          name: "Bottom Banner Ad Slot",
          image: null, // Set to null to show the placeholder
          active: true,
          position: "right_bottom",
          clicks: 187,
        },
      ];

      // Find an active ad for the specified position
      const matchingAd = mockAds.find(
        (ad) => ad.position === position && ad.active
      );

      setTimeout(() => {
        setAd(matchingAd || null);
        setLoading(false);
      }, 500);
    };

    fetchAd();
  }, [position]);

  const handleClick = () => {
    if (ad) {
      // In a real app, you would track this click and redirect to the advertiser's URL
      console.log(`Ad clicked: ${ad.name}`);

      // Simulate tracking the click
      setAd((prev) => (prev ? { ...prev, clicks: prev.clicks + 1 } : null));
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

  if (!ad) {
    return null;
  }

  // Display placeholder for empty state
  if (!ad.image) {
    return (
     <div>
       <Card
        className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className} h-[250px] w-[230px] mx-auto bg-gray-50 border border-gray-200 flex flex-col items-center justify-center`}
        onClick={handleClick}
      >
        <Upload className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">Upload Image</p>
        <p className="text-xs text-gray-400 mt-2">Recommended: 600x800px</p>
        <p className="text-xs text-gray-400">Max 5MB</p>
      </Card>
      <Card
        className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className} h-[250px] w-[230px] mx-auto bg-gray-50 border border-gray-200 flex flex-col items-center justify-center`}
        onClick={handleClick}
      >
        <Upload className="h-12 w-12 text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">Upload Image</p>
        <p className="text-xs text-gray-400 mt-2">Recommended: 600x800px</p>
        <p className="text-xs text-gray-400">Max 5MB</p>
      </Card>
     </div>
    );
  }

  return (
    <Card
      className={`overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className} h-[250px] w-[230px] mx-auto`}
      onClick={handleClick}
    >
      <img
        src={ad.image}
        alt={ad.name}
        className="w-full h-full object-cover"
      />
    </Card>
  );
};

export default AdBanner;
