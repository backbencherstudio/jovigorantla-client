
import { useNavigate } from 'react-router-dom';
import { memo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import adService from '@/services/adService';

interface AdCardProps {
  ad: {
    id: string;
    name?: string;
    image_url: string;
    target_url: string;
    group?: string;
  };
  compact?: boolean;
}

const AdCard = memo(({ ad, compact = false }: AdCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    // Record the ad click
    // adService.recordAdClick(ad.id);
    
    // // Open in new tab if external URL, navigate if internal
    // if (ad.targetUrl.startsWith('http')) {
    //   window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    // } else {
    //   navigate(ad.targetUrl);
    // }
  };

  return (
    <Card 
      className="overflow-hidden border-0 group transition-all duration-300 hover:shadow-md h-full bg-white animate-scale-in cursor-pointer w-full max-w-md mx-auto"
      onClick={handleClick}
    >
      <div className="relative">
        <div style={{ paddingBottom: compact ? '70%' : '56.25%' }} className="relative overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-full w-full"></div>
            </div>
          )}
          <img
            src={ad.image_url}
            alt={ad.name || "Advertisement"}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white text-xs">
              Ad
            </Badge>
          </div>
        </div>
      </div>
      
      {!compact && ad.name && (
        <CardContent className="p-3">
          <h3 className="font-medium text-balance leading-tight text-base">
            {ad.name}
          </h3>
        </CardContent>
      )}
    </Card>
  );
});

AdCard.displayName = 'AdCard';

export default AdCard;
