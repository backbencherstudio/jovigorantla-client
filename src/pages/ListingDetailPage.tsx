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
