import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Share2,
  Star,
  MoreVertical,
  Flag,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockListings } from "@/utils/mockData";
import { formatDistanceToNow, set } from "date-fns";
import PhotoGallery from "@/components/PhotoGallery";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import AuthModal from "@/components/AuthModal";
import { api } from "@/lib/axois";
import { formatTime } from "@/lib/utils";

const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"login" | "signup">("login");
  const [listing, setListing] = useState<any>({});

  // In a real app, you would fetch the listing details from an API
  // For now, we'll use mock data
  // const listing = mockListings.find((l) => l.id === id) || mockListings[0];

  const fetchListingsDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/listings/${id}`);
      if(data?.success) {
        setListing(data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }



  // // Format time consistently as "2m ago", "2h ago", "2d ago" to match listings
  // const formatTime = (date: Date) => {
  //   const timeAgo = formatDistanceToNow(new Date(date), {
  //     addSuffix: true,
  //   });

  //   // Replace "about" with empty string
  //   let formattedTime = timeAgo.replace("about ", "");

  //   // Replace "less than a minute" with "1m"
  //   formattedTime = formattedTime.replace("less than a minute ago", "1m ago");

  //   // Replace "1 minute" with "1m"
  //   formattedTime = formattedTime.replace("1 minute ago", "1m ago");

  //   // Replace "X minutes" with "Xm"
  //   formattedTime = formattedTime.replace(/(\d+) minutes? ago/, "$1m ago");

  //   // Replace "1 hour" with "1h"
  //   formattedTime = formattedTime.replace("1 hour ago", "1h ago");

  //   // Replace "X hours" with "Xh"
  //   formattedTime = formattedTime.replace(/(\d+) hours? ago/, "$1h ago");

  //   // Replace "1 day" with "1d"
  //   formattedTime = formattedTime.replace("1 day ago", "1d ago");

  //   // Replace "X days" with "Xd"
  //   formattedTime = formattedTime.replace(/(\d+) days? ago/, "$1d ago");
  //   return formattedTime;
  // };
  const [width, setWidth] = useState("500px");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Function to update width based on screen size
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024 && screenWidth < 1300) {
        setWidth(`${screenWidth - 540}px`);
      } else {
        setWidth("768px");
      }
    };
    // Set initial width
    updateWidth();
    // Add event listener for window resize
    window.addEventListener("resize", updateWidth);
    fetchListingsDetails()
    // Clean up event listener
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // const timeAgo = formatTime(new Date(listing.created_at));

  const handleContact = () => {
    if (user) {
      // Find or create conversation for this listing
      const conversationId = "1"; // In a real app, this would be fetched or created

      // Redirect to the specific conversation
      navigate(`/messages/${conversationId}`);
    } else {
      setIsOpen(true);
    }
  };

  const toggleSaveListing = () => {
    if (!user) {
      setIsOpen(true);
      return;
    }
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

  const handleListingAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();

    switch (action) {
      case "share":
        toast.success(`Sharing listing: "${listing?.title}"`, {
          description: "Opening sharing options",
        });
        // Use Web Share API if available, otherwise copy to clipboard
        if (navigator.share) {
          navigator.share({
            title: listing?.title,
            text: `Check out this listing: ${listing?.title}`,
            url: `${window.location.origin}/listing/${listing?.id}`,
          });
        } else {
          navigator.clipboard.writeText(
            `${window.location.origin}/listing/${listing?.id}`
          );
          toast.success("Link copied to clipboard");
        }
        break;
      case "hide":
        toast.success(`Listing hidden: "${listing?.title}"`, {
          description: "You won't see this listing anymore",
        });
        break;
      case "report":
        toast.success(`Listing reported: "${listing?.title}"`, {
          description: "Thank you for helping keep our community safe",
        });
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const closeModal = () => setIsOpen(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Format category and status for display, to match listing cards
  const formatCategoryStatus = (category: string) => {
    // Convert category to singular for display
    let displayCategory = category;
    if (category === "Accommodations") displayCategory = "Accommodation";
    if (category === "Rides") displayCategory = "Ride";
    if (category === "Jobs") displayCategory = "Job";
    const displayStatus = "Looking";
    return {
      displayCategory,
      displayStatus,
    };
  };

  const { displayCategory, displayStatus } = formatCategoryStatus(
    listing.category
  );

  // Extract city and state from location
  // const locationParts = listing.location.address.split(",");
  // const locationParts = "location"
  // const city = locationParts[0]?.trim() || "";
  // const state = locationParts[1]?.trim() || "";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Listing content - make it scrollable but with room for the fixed button at bottom */}
      <div className="flex-1 py-[10px] overflow-y-auto pb-24 max-w-3xl mx-auto w-full">
        {/* Category, status and action buttons */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-500 text-sm gap-1">
            <span>{displayCategory?.slice(0,1).toUpperCase() + displayCategory?.slice(1).toLowerCase()}</span>
            <span className="mx-2">•</span>
            <span>{displayStatus?.slice(0,1).toUpperCase() + displayStatus?.slice(1).toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSaveListing}
                className="h-8 w-8"
              >
                <Star
                  className={`h-5 w-5 ${
                    isSaved ? "fill-[#ff6b00] text-[#ff6b00]" : ""
                  }`}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => handleListingAction(e, "share")}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleListingAction(e, "hide")}
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    <span>Hide</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => handleListingAction(e, "report")}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    <span>Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>

          {/* User info and metadata - updated format */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{listing?.user?.name}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(listing?.created_at)}</span>
            <span className="mx-2">•</span>
            <span>Denton, TX</span>
          </div>

          {/* Description - only show if it exists */}
          {listing.description && (
            <Card className="mb-6 border-none shadow-none">
              <CardContent className="p-0">
                <h2 className="text-lg font-bold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Photo Gallery - only show if there are images and not for jobs/rides */}
          {listing.image && !["Jobs", "Rides"].includes(listing.category) && (
            // <PhotoGallery images={[listing.image]} listingId={listing.id} />
            <img src={`${listing.image_url}`} alt="listing" className="w-full h-[400px] object-cover" />
          )}
        </div>
        {/* Contact button - only show on desktop */}
        {!isMobile && (
          <div className="w-full relative ">
            <div
              style={{ width: width }}
              className="my-8 p-4 bg-white  mx-auto fixed  -bottom-10 "
            >
              <Button
                onClick={handleContact}
                className=" bg-[#ff6b00] w-full hover:bg-[#ff6b00]/90 text-white py-6 text-lg text-center"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </Button>
            </div>
            <div className="h-16"></div>
          </div>
        )}
      </div>

      {/* Fixed button at the bottom only for mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 py-4 px-4 bg-white border-t shadow-md">
          <div className="max-w-3xl mx-auto">
            <Button
              onClick={handleContact}
              className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white py-6 text-lg text-center"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Message
            </Button>
          </div>
        </div>
      )}
      <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab as "login" | "signup"}
      />
    </div>
  );
};

export default ListingDetailPage;
