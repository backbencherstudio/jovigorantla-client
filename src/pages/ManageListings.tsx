import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
type ListingType = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  location: string;
};
const ManageListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);

  // Mock listings data
  const mockUserListings = [
    {
      id: "101",
      title: "Looking for a roommate in a 2bedroom apartment",
      category: "Accommodation",
      status: "Available",
      createdAt: "Mar 15, 2023",
      location: "Denton, TX",
    },
    {
      id: "102",
      title: "1BHK apartment available for rent near UNT",
      category: "Accommodation",
      status: "Available",
      createdAt: "Apr 22, 2023",
      location: "Denton, TX",
    },
  ];
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setIsLoading(true);

    // In a real app, we would fetch the user's listings from the database
    // For now, we'll use mock data
    setTimeout(() => {
      // Check if we have listings data stored in localStorage
      const storedListings = localStorage.getItem(`userListings_${user.id}`);
      if (storedListings) {
        setListings(JSON.parse(storedListings));
      } else {
        // If no stored listings, use the mock data and save it to localStorage
        setListings(mockUserListings);
        localStorage.setItem(
          `userListings_${user.id}`,
          JSON.stringify(mockUserListings)
        );
      }
      setIsLoading(false);
    }, 1000);
  }, [user, navigate]);
  const handleEditListing = (id: string) => {
    navigate(`/create-listing?edit=${id}`);
  };
  const openDeleteDialog = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setListingToDelete(id);
  };
  const deleteListing = () => {
    if (!listingToDelete) return;
    const updatedListings = listings.filter(
      (listing) => listing.id !== listingToDelete
    );
    setListings(updatedListings);

    // Update localStorage
    if (user) {
      localStorage.setItem(
        `userListings_${user.id}`,
        JSON.stringify(updatedListings)
      );
    }
    toast.success("Listing deleted successfully", {});
    setListingToDelete(null);
  };
  if (!user) return null;
  return (
    <div className="bg-gray-50">
      <div className="bg-white p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first listing to get started.
                </p>
                <Button
                  onClick={() => navigate("/create-listing")}
                  variant="default"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className=" rounded-lg p-4 w-full hover:bg-gray-50 border-b transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg mb-1">
                          {listing.title}
                        </h3>
                        <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1">
                          <div className="flex items-center">
                            <span>Category: {listing.category}</span>
                          </div>
                          <div className="flex items-center">
                            <span>Status: {listing.status}</span>
                          </div>
                          <div className="flex items-center">
                            <span>Created: {listing.createdAt}</span>
                          </div>
                          <div className="flex items-center">
                            <span>Location: {listing.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditListing(listing.id)}
                          className="h-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => openDeleteDialog(e, listing.id)}
                          className="h-8 text-[#bc0117] hover:text-[#bc0117] hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <AlertDialog
          open={!!listingToDelete}
          onOpenChange={(open) => !open && setListingToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your listing. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteListing}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
export default ManageListings;
