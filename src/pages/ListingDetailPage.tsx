import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    setScrollY(0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      setIsScrolling(false);
    };
  }, []);

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

  const [width, setWidth] = useState("500px");

  useEffect(() => {
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

  const handleContact = async () => {
    try {
      if (user) {
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
      <div className="flex items-center justify-center h-[calc(100vh-110px)]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleImageClick = (imageUrl: string) => {
    setIsImageModalOpen(true);
    setImageUrl(imageUrl);
  };

  return (
    <>
    
      <div className="bg-white min-h-[calc(100vh-110px)] h-full">
        <div
          className={`${
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
                <ListingActions
                  listingId={listing.id}
                  listingTitle={listing.title}
                  isUsa={false}
                  onToggleSave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                      {city +
                        ", " +
                        (usStates[stateAbbr.toLocaleLowerCase()] || stateAbbr)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {listing.image && !["Jobs", "Rides"].includes(listing.category) && (
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
          {!isMobile && user?.id !== listing?.user_id && listing && (
            <div className="w-full relative">
              <div
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

        {/* Modal for full image display */}
        {isImageModalOpen && (
          <div
            className="fixed h-full w-full top-0 left-0 z-[103] p-2 flex items-center justify-center bg-[rgba(0,0,0,0.6)] cursor-pointer"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div className="h-auto max-h-[90vh] max-w-[768px] w-full mx-auto flex items-center justify-center relative rounded-md overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <img
                src={image_url}
                alt={listing.title}
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
      </div>
    </>
  );
};

export default ListingDetailPage;
