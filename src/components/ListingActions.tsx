import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MoreVertical, Share2, EyeOff, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface ListingActionsProps {
  listingId: string;
  listingTitle: string;
  saved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

const ListingActions = ({
  listingId,
  listingTitle,
  saved,
  onToggleSave,
}: ListingActionsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleListingAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();

    switch (action) {
      case "share":
        toast.success(`Sharing listing: "${listingTitle}"`, {
          description: "Opening sharing options",
        });
        // Use Web Share API if available, otherwise copy to clipboard
        if (navigator.share) {
          navigator.share({
            title: listingTitle,
            text: `Check out this listing: ${listingTitle}`,
            url: `${window.location.origin}/listing/${listingId}`,
          });
        } else {
          navigator.clipboard.writeText(
            `${window.location.origin}/listing/${listingId}`
          );
          toast.success("Link copied to clipboard");
        }
        break;
      case "hide":
        toast.success(`Listing hidden: "${listingTitle}"`, {
          description: "You won't see this listing anymore",
        });
        break;
      case "report":
        toast.success(`Listing reported: "${listingTitle}"`, {
          description: "Thank you for helping keep our community safe",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center  ">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={(e) => onToggleSave(e, listingId)}
      >
        <Star
          className={`h-5 w-5 ${
            saved ? "fill-[#ff6b00] text-[#ff6b00]" : "text-gray-400"
          }`}
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem onClick={(e) => handleListingAction(e, "share")}>
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleListingAction(e, "hide")}>
            <EyeOff className="h-4 w-4 mr-2" />
            <span>Hide</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleListingAction(e, "report")}>
            <Flag className="h-4 w-4 mr-2" />
            <span>Report</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ListingActions;
