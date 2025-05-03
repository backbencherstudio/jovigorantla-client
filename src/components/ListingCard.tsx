import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MapPin } from "lucide-react";
import { Listing } from "@/utils/mockData";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface ListingCardProps {
  listing: Listing & { status?: string };
  compact?: boolean;
}

const ListingCard = ({ listing, compact = false }: ListingCardProps) => {
  const {
    id,
    title,
    price,
    location,
    image,
    category,
    createdAt,
    radius,
    status = "Available", // Provide a default value
  } = listing;

  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  // Format time consistently as "2m ago", "2h ago", "2d ago"
  const formatTime = (date: Date | string) => {
    const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

    // Replace "about" with empty string
    let formattedTime = timeAgo.replace("about ", "");

    // Replace "less than a minute" with "1m"
    formattedTime = formattedTime.replace("less than a minute ago", "1m ago");

    // Replace "1 minute" with "1m"
    formattedTime = formattedTime.replace("1 minute ago", "1m ago");

    // Replace "X minutes" with "Xm"
    formattedTime = formattedTime.replace(/(\d+) minutes? ago/, "$1m ago");

    // Replace "1 hour" with "1h"
    formattedTime = formattedTime.replace("1 hour ago", "1h ago");

    // Replace "X hours" with "Xh"
    formattedTime = formattedTime.replace(/(\d+) hours? ago/, "$1h ago");

    // Replace "1 day" with "1d"
    formattedTime = formattedTime.replace("1 day ago", "1d ago");

    // Replace "X days" with "Xd"
    formattedTime = formattedTime.replace(/(\d+) days? ago/, "$1d ago");

    // Replace "yesterday" with "1d ago"
    formattedTime = formattedTime.replace("yesterday", "1d ago");

    // Replace "today" with appropriate hours
    formattedTime = formattedTime.replace(
      "today",
      new Date().getHours() + "h ago"
    );

    return formattedTime;
  };

  const timeAgo = formatTime(createdAt);

  const handleClick = () => {
    navigate(`/listing/${id}`);
  };

  // Format category and status for displaying on listing cards
  const formatCategoryStatus = () => {
    // Convert category to singular for listing cards
    let displayCategory = category;
    if (category === "Accommodations") displayCategory = "Accommodation";
    if (category === "Rides") displayCategory = "Ride";
    if (category === "Jobs") displayCategory = "Job";

    // For Marketplace, change the status to Item/Service
    let displayStatus = status;
    if (category === "Marketplace") {
      if (status === "Items") displayStatus = "Item";
      if (status === "Services") displayStatus = "Service";
    }

    return { displayCategory, displayStatus };
  };

  const { displayCategory, displayStatus } = formatCategoryStatus();

  return (
    <Card
      className="overflow-hidden border-0 group transition-all duration-300 hover:shadow-md h-full bg-white animate-scale-in cursor-pointer w-full max-w-md mx-auto"
      onClick={handleClick}
    >
      <div className="relative">
        <div
          style={{ paddingBottom: compact ? "70%" : "56.25%" }}
          className="relative overflow-hidden bg-gray-100"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 h-full w-full"></div>
            </div>
          )}
          <img
            src={image}
            alt={title}
            className={`absolute inset-0 w-full h-full  transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute top-2 left-2">
            <span className="pill bg-primary text-white">
              {displayCategory}
            </span>
          </div>

          <div className="absolute bottom-2 right-2">
            <span className="pill bg-black/70 text-white">
              {formattedPrice}
            </span>
          </div>

          <div className="absolute bottom-2 left-2">
            <span
              className={`pill ${
                displayStatus === "Available" || displayStatus === "Hiring"
                  ? "bg-primary/90"
                  : "bg-blue-500/90"
              } text-white`}
            >
              {displayStatus}
            </span>
          </div>
        </div>
      </div>

      <CardContent className={`p-3 ${compact ? "space-y-1" : "space-y-2"}`}>
        <div className="flex justify-between items-start">
          <h3
            className={`font-medium text-balance leading-tight ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {title}
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-muted-foreground ml-1 flex-shrink-0">
                  <MapPin className={`${compact ? "h-3 w-3" : "h-4 w-4"}`} />
                  <span className="text-xs ml-0.5">{radius}mi</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Within {radius} mile radius</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className={`flex justify-between items-center text-xs text-muted-foreground ${
            compact ? "mt-1" : ""
          }`}
        >
          <div className="truncate mr-2" title={location.address}>
            {location.address}
          </div>
          <div className="flex-shrink-0">{timeAgo}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
