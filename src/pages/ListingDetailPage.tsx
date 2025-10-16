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

  return (
    <>
      <div className=" bg-white min-h-[calc(100vh-110px)] p-2 py-4 lg:p-4 pb-0 lg:pb-0">
        <h1>TItle</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
          dignissimos cupiditate eius id accusantium minus possimus impedit at
          fugit! Officiis numquam, minus voluptatum molestiae in voluptates
          neque. Inventore, debitis. Ex.
        </p>
      </div>
    </>
  );
};

export default ListingDetailPage;
