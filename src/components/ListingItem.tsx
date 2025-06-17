import { Link, useNavigate } from "react-router-dom";
import { ListingType } from "@/types/listing";
import ListingActions from "./ListingActions";
import { getAddressFromCoordinates } from "@/hooks/getAddress";
import { formatTime } from "@/lib/utils";

interface ListingItemProps {
  listing: ListingType;
  isUsa: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

const ListingItem = ({ listing, onToggleSave, isUsa }: ListingItemProps) => {
  const navigate = useNavigate();

  // Format category and status for display
  const formatCategoryStatus = (category: string, status: string) => {
    // Convert category to singular for display
    let displayCategory = category;
    if (category === "ACCOMMODATIONS") displayCategory = "Accommodation";
    if (category === "RIDES") displayCategory = "Ride";
    if (category === "JOBS") displayCategory = "Job";

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
    listing.sub_category
  );

  const handleClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <Link
      to={`/listing/${listing.slug}`}
      key={listing.id}
      className="bg-white flex max-w-[576px] rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    // onClick={handleClick}
    >
      <div className="p-4 pb-2 lg:pb-4 flex flex-col flex-1 text-sm text-gray-500">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <span>{displayCategory?.slice(0, 1).toUpperCase() + displayCategory?.slice(1).toLowerCase()}</span>
          <span className="mx-2">•</span>
          <span>{displayStatus?.slice(0, 1).toUpperCase() + displayStatus?.slice(1).toLowerCase()}</span>
        </div>

        <div
          className={`${listing?.title?.length > 40 ? "mb-0" : "mb-7 sm:mb-0"}`}
        >
          <h3 className="text-lg font-medium text-gray-900 lg:text-nowrap line-clamp-2 ">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span>{listing.user.name}</span>
            {listing?.created_at && (
              <>
                <span className="mx-2">•</span>
                <span>{formatTime(listing?.created_at)}</span>
              </>
            )}
            {/* <span>{getAddressFromCoordinates(listing.latitude, listing.longitude)}</span> */}
            {listing?.address && (
              <>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <span>
                    {listing.address.split(',').filter((_, i) => i === 0 || i === 1).join(', ')}
                  </span>
                </div>
              </>
            )}
          </div>

          <ListingActions
            listingId={listing.id}
            listingTitle={listing.title}
            isUsa={isUsa}
            // saved={listing.saved || false}
            // saved={false}
            // onToggleSave={onToggleSave}
            onToggleSave={(e) => {
              e.preventDefault(); // ✅ prevent default link navigation
              e.stopPropagation(); // ✅ stop event bubbling
              onToggleSave(e, listing.id);
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ListingItem;
