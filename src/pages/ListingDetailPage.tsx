import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Share2,
  Star,
  MoreVertical,
  Flag,
  EyeOff,
  ArrowLeft,
  Expand,
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
import { formatCategory, formatSubCategory } from "@/lib/format";
import ListingActions from "@/components/ListingActions";
import { useMessages } from "@/context/MessageContext";
import { RxCross2 } from "react-icons/rx";
import usStates from "@/data/states";

const renderDescriptionWithPhoneLinks = (text: string) => {
  const phoneRegex = /(\b\d{10,}\b)/g;
  const parts = text.split(phoneRegex);

  return parts.map((part, index) => {
    if (phoneRegex.test(part)) {
      return (
        <a
          key={index}
          href={`tel:${part}`}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const ListingDetailPage = ({ openModal }) => {
  const isDesktop = useMediaQuery("(min-width: 1101px)");

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"login" | "signup">("login");
  const [listing, setListing] = useState<any>({});

  const { handleConversationCreated } = useMessages();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [image_url, setImageUrl] = useState("");

  // In a real app, you would fetch the listing details from an API
  // For now, we'll use mock data
  // const listing = mockListings.find((l) => l.id === id) || mockListings[0];

  const fetchListingsDetails = useCallback(async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      if (data?.success) {
        //setLoading(false);
        setListing(data?.data);
      } else {
        //setLoading(false);
        // if data not found redirect to home
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const [city, stateAbbr] =
    listing.address?.split(",").map((part) => part.trim()) || [];

  // console.log(listing)

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
    /*  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.documentElement.scrollTo(0, 0);
    }; */

    // Initial scroll
    ///scrollToTop();

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
    fetchListingsDetails();
    // Clean up event listener
    return () => window.removeEventListener("resize", updateWidth);
  }, [id, navigate]);

  // const timeAgo = formatTime(new Date(listing.created_at));

  const handleContact = async () => {
    try {
      if (user) {
        // console.log("user", user);
        // console.log(listing)

        // console.log({
        //   creator_id: user?.id,
        //   participant_id: listing?.user?.id,
        //   listing_id: listing?.id,
        // })

        const conversation = await api.post("/chat/conversation", {
          creator_id: user?.id,
          participant_id: listing?.user?.id,
          listing_id: listing?.id,
        });

        console.log("conversation", conversation);

        if (conversation?.data?.success) {
          handleConversationCreated({ data: conversation?.data?.data });
          // console.log("conversation", conversation?.data?.data.id);
          navigate(`/messages/${conversation?.data?.data.id}`);
          // navigate(`/messages/${1}`);
        }

        // Redirect to the specific conversation
        // navigate(`/messages/${conversationId}`);
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
    // if (user) {
    //   // Find or create conversation for this listing
    //   const conversationId = "1"; // In a real app, this would be fetched or created

    //   // Redirect to the specific conversation
    //   navigate(`/messages/${conversationId}`);
    // } else {
    //   setIsOpen(true);
    // }
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

  if (loading || !listing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Format category and status for display, to match listing cards
  // const formatCategoryStatus = (category: string) => {
  //   // Convert category to singular for display
  //   let displayCategory = category;
  //   if (category === "ACCOMMODATIONS") displayCategory = "Accommodation";
  //   if (category === "Rides") displayCategory = "Ride";
  //   if (category === "Jobs") displayCategory = "Job";
  //   const displayStatus = "Looking";
  //   return {
  //     displayCategory,
  //     displayStatus,
  //   };
  // };

  // const { displayCategory, displayStatus } = formatCategoryStatus(
  //   listing.category
  // );

  // Extract city and state from location
  // const locationParts = listing.location.address.split(",");
  // const locationParts = "location"
  // const city = locationParts[0]?.trim() || "";
  // const state = locationParts[1]?.trim() || "";

  // Handle Image Click
  const handleImageClick = (imageUrl: string) => {
    setIsImageModalOpen(true);
    setImageUrl(imageUrl);
  };

  return (
    <>
      {/* min-h-[calc(100vh-120px)] */}
      <div className="flex flex-col bg-white">
        {/* Listing content - make it scrollable but with room for the fixed button at bottom */}
        {/* Previously Class flex-1 py-[10px] overflow-y-auto pb-24  mx-auto w-full p-0 sm:pl-16 lg:pl-0 */}
        <div
          className={`flex-1 overflow-y-auto ${
            isMobile && user?.id !== listing?.user_id && listing && "pb-24"
          } mx-auto w-full p-2 py-4`}
        >
          {/* Category, status and action buttons */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-gray-500 text-base gap-1">
                <span>{formatCategory(listing.category)}</span>
                <span className="mx-2">•</span>
                <span>
                  {formatSubCategory(listing.category, listing.sub_category)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* <Button
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
              </DropdownMenu> */}
                <ListingActions
                  listingId={listing.id}
                  listingTitle={listing.title}
                  isUsa={false}
                  // saved={listing.saved || false}
                  // saved={false}
                  // onToggleSave={onToggleSave}
                  onToggleSave={(e) => {
                    e.preventDefault(); // ✅ prevent default link navigation
                    e.stopPropagation(); // ✅ stop event bubbling
                  }}
                  onHide={() => {}}
                  openModal={openModal}
                />
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-bold mb-4  line-2"
              style={{ lineHeight: 1.4 }}
            >
              {listing.title}
              {/* Private accommodation available in Irving from August 1st for 2 males in 2bed 2bath */}
            </h1>

            {/* User info and metadata - updated format */}
            <div className="flex flex-wrap items-center text-base text-gray-500 mb-4">
              <span>{listing?.user?.name?.slice(0, 15)}</span>
              <span className="mx-2">•</span>
              <span>{formatTime(listing?.created_at)}</span>
              {listing?.address && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <span>
                      {/* {listing.address
                        ?.split(",")
                        .filter((_, i) => i === 0 || i === 1)
                        .join(", ")} */}
                      {city +
                        ", " +
                        (usStates[stateAbbr.toLocaleLowerCase()] || stateAbbr)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {listing.image && !["Jobs", "Rides"].includes(listing.category) && (
              // <PhotoGallery images={[listing.image]} listingId={listing.id} />
              <div
                className="relative w-full max-w-full rounded-lg shadow-md bg-white cursor-pointer"
                style={{ aspectRatio: "574/300" }}
              >
                <img
                  onClick={() => handleImageClick(listing.image_url)}
                  src={listing.image_url}
                  alt={listing.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />

                <span className="absolute bottom-2 right-2 text-white h-[40px] w-[40px] bg-[#474849a6] rounded-full flex items-center justify-center pointer-events-none">
                  <Expand className="h-5 w-5" />
                </span>

                {/* <img src={`${listing.image_url}`} alt="listing" className="w-full h-[400px] object-cover rounded-lg" /> */}
              </div>
            )}

            {/* Description - only show if it exists */}
            {listing.description && (
              <Card className="mb-6 border-none shadow-none mt-4">
                <CardContent className="p-0">
                  <h2 className="text-lg font-bold mb-0">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {renderDescriptionWithPhoneLinks(listing.description)}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          {/* Contact button - only show on desktop */}
          {/* max-w-xl lg:max-w-[30rem] xl:max-w-3xl  */}
          {!isMobile && user?.id !== listing?.user_id && listing && (
            <div className="w-full relative">
              <div
                // style={{ width: width }}
                className={`my-8 p-4 bg-white  fixed ${
                  user ? "" : "md:bottom-1 "
                } ${
                  isDesktop ? "lg:-bottom-10" : ""
                } left-1/2 -translate-x-1/2 -bottom-10 mx-auto w-full max-w-3xl md:max-w-[35rem] xl:max-w-[47rem]`}
              >
                <Button
                  onClick={handleContact}
                  className="bg-[#ff6b00] w-full hover:bg-[#ff6b00]/90 text-white py-6 text-lg text-center"
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
        {isMobile && user?.id !== listing?.user_id && listing && (
          <div
            className={`fixed ${
              user ? "bottom-0" : "bottom-10"
            } left-0 right-0 py-4 px-4 bg-white border-t shadow-md`}
          >
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

      {/* Modal for full image display */}
      {isImageModalOpen && (
        <div
          className="fixed h-full w-full top-0 left-0 z-[103] p-2 flex items-center justify-center bg-[rgba(0,0,0,0.6)] cursor-pointer"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="h-auto max-h-[90vh] max-w-[768px] w-full mx-auto flex items-center justify-center relative rounded-md overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            /* style={{
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }} */
          >
            <img
              src={image_url}
              alt="Image"
              className="w-full object-contain rounded-md"
            />

            <button
              className="absolute top-5 right-4 text-white h-[30px] w-[30px] bg-[#474849a6] rounded-full flex items-center justify-center"
              onClick={() => setIsImageModalOpen(false)}
            >
              <RxCross2 className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingDetailPage;
