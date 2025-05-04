import { useNavigate } from "react-router-dom";
import { ListingType } from "@/types/listing";
import ListingActions from "./ListingActions";

interface ListingItemProps {
  listing: ListingType;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

const ListingItem = ({ listing, onToggleSave }: ListingItemProps) => {
  const navigate = useNavigate();

  // Format category and status for display
  const formatCategoryStatus = (category: string, status: string) => {
    // Convert category to singular for display
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

  const { displayCategory, displayStatus } = formatCategoryStatus(
    listing.category,
    listing.status
  );

  const handleClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <div
      key={listing.id}
      className="bg-white max-w-[576px] rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <span>{displayCategory}</span>
          <span className="mx-2">•</span>
          <span>{displayStatus}</span>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2 text-nowrap overflow-hidden text-ellipsis">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span>{listing.userName}</span>
            <span className="mx-2">•</span>
            <span>{listing.postedTime}</span>
            <span className="mx-2">•</span>
            <span>{listing.location}</span>
          </div>

          <ListingActions
            listingId={listing.id}
            listingTitle={listing.title}
            saved={listing.saved || false}
            onToggleSave={onToggleSave}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
