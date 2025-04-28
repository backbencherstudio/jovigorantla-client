import { useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Share2,
  Star,
  MoreVertical,
  EyeOff,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Listing } from "@/utils/mockData";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
  onContact?: () => void;
}

const ListingDetail = ({ listing, onBack, onContact }: ListingDetailProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const { title, description, location, image, category, createdAt, userId } =
    listing;

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Extract city from location
  const locationParts = location.address.split(",");
  const city = locationParts[0]?.trim() || "";

  const toggleSaveListing = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (isMobile && navigator.share) {
      // Use Web Share API for mobile
      navigator.share({
        title: listing.title,
        text: `Check out this listing: ${listing.title}`,
        url: window.location.href,
      });
    } else {
      // Copy to clipboard for desktop
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with back button and actions */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={toggleSaveListing}>
            <Star
              className={`h-5 w-5 ${
                isSaved ? "fill-[#ff6b00] text-[#ff6b00]" : ""
              }`}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EyeOff className="h-4 w-4 mr-2" />
                <span>Hide</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag className="h-4 w-4 mr-2" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
          <div className="flex items-center gap-2">
            <span>{category}</span>
            <span>•</span>
            <span>Looking</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        {/* User info and metadata - using the same format as listings */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{userId.substring(0, 8)}</span>
          <span className="mx-2">•</span>
          <span>{city}</span>
          <span className="mx-2">•</span>
          <span>{timeAgo}</span>
        </div>

        {description && (
          <Card className="mb-4 border-none shadow-none">
            <CardContent className="p-0">
              <h2 className="text-lg font-bold mb-2">Description</h2>
              <p className="text-gray-700">{description}</p>
            </CardContent>
          </Card>
        )}

        {image && (
          <div className="my-4">
            <img
              src={image}
              alt={title}
              className="w-full rounded-lg"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}

        <Button
          className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white py-5 mt-4"
          onClick={onContact}
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Message
        </Button>
      </div>
    </div>
  );
};

export default ListingDetail;
