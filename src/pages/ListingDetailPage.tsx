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
      <div className=" bg-white min-h-[calc(100vh-110px)] p-2 py-4 lg:p-4 pb-0 lg:pb-0">
        <h1>TItle</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
          dignissimos cupiditate eius id accusantium minus possimus impedit at
          fugit! Officiis numquam, minus voluptatum molestiae in voluptates
          neque. Inventore, debitis. Ex. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis sunt facere ducimus error sequi inventore dolorem ut tenetur atque maiores vel excepturi, illum dolore fugiat ratione aspernatur architecto provident debitis?
        </p>
      </div>
    </>
  );
};

export default ListingDetailPage;
