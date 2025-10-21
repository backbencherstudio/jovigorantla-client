import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, MoreVertical, Share2, EyeOff, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axois";
import { formatTime } from "@/lib/utils";
import { formatCategory, formatSubCategory } from "@/lib/format";
import ListingActions from "@/components/ListingActions";
import AboutFooter from "./AboutFooter";
import usStates from "@/data/states";

const SavedListings = () => {
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

  const {
    user,
    favoritesListings,
    deleteFavoritesListing,
    fetchFavoritesListings,
  } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  //console.log("favoritesListings from context:", favoritesListings);

  // Fetch saved listings from API
  const fetchSavedListings = useCallback(async () => {
    if (!user) return;

    try {
      //setIsLoading(true);

      // If fetchFavoritesListings exists in context, use it
      if (fetchFavoritesListings) {
        // await fetchFavoritesListings();
      } else {
        // Otherwise fetch directly
        // const response = await api.get("/favorites");
        // const savedListings = response.data.data || [];
        // setListings(savedListings);
      }
    } catch (error) {
      console.error("Error fetching saved listings:", error);
      toast.error("Failed to load saved listings");
    } finally {
      //setIsLoading(false);
      setIsInitialized(true);
    }
  }, [user, fetchFavoritesListings]);

  // Initialize component
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    //If favoritesListings is already populated, use it
    if (favoritesListings && favoritesListings.length > 0) {
      setListings(favoritesListings);
      //setIsLoading(false);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // If favoritesListings is empty and we haven't initialized, fetch from API
      fetchSavedListings();
    }
  }, [user, navigate, favoritesListings, isInitialized, fetchSavedListings]);

  // Update listings when favoritesListings changes
  useEffect(() => {
    if (favoritesListings && favoritesListings.length > 0) {
      setListings(favoritesListings);

      //setIsLoading(false);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else if (
      isInitialized &&
      favoritesListings &&
      favoritesListings.length === 0
    ) {
      // If initialized and favoritesListings is explicitly empty array
      setListings([]);

      //setIsLoading(false);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [favoritesListings, isInitialized]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        console.log("Page became visible, refreshing saved listings");
        //fetchSavedListings();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSavedListings, user]);

  const handleListingClick = (id) => {
    navigate(`/listing/${id}`);
  };

  const toggleSaveListing = async (e, listingId) => {
    e.stopPropagation();
    try {
      await deleteFavoritesListing(listingId);
      setListings(listings.filter((l) => l.id !== listingId));
      toast.success("Listing removed from saved");
    } catch (error) {
      console.error("Error removing listing:", error);
      toast.error("Failed to remove listing");
    }
  };

  const handleListingAction = (e, action, listingId) => {
    e.stopPropagation();

    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    switch (action) {
      case "share":
        if (navigator.share) {
          navigator.share({
            title: listing.title,
            text: `Check out this listing: ${listing.title}`,
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
        setListings(listings.filter((l) => l.id !== listingId));
        toast.success("Listing hidden");
        break;
      case "report":
        toast.success(`Listing reported: "${listing.title}"`);
        break;
      default:
        break;
    }
  };

  // Redirect if no user
  if (!user) return null;

  return (
    <div className="bg-white min-h-[calc(100vh-110px)]">
      <div className="mx-auto w-full px-4 py-4">
        <h1>Saved Listing Page</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
          amet, alias odio mollitia quae tenetur non optio eius pariatur ducimus
          quod tempora eligendi vero, facere minus laudantium molestiae ab a
          similique eveniet, nulla ipsa? Id vero illum, explicabo ipsam ullam
          blanditiis nemo accusantium amet architecto, recusandae voluptatem
          minus inventore harum aliquam aut deserunt cumque dolores fugiat quae
          labore beatae porro! Earum autem eos, neque tempore fugit saepe
          molestias illo nobis a aliquam quas! Saepe ab consequatur illo,
          molestias ea, nulla nostrum, ipsum hic fuga quod sunt corrupti culpa
          cum adipisci necessitatibus vel qui illum nam ullam deserunt assumenda
          error quis? Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Deleniti amet, alias odio mollitia quae tenetur non optio eius
          pariatur ducimus quod tempora eligendi vero, facere minus laudantium
          molestiae ab a similique eveniet, nulla ipsa? Id vero illum, explicabo
          ipsam ullam blanditiis nemo accusantium amet architecto, recusandae
          voluptatem minus inventore harum aliquam aut deserunt cumque dolores
          fugiat quae labore beatae porro! Earum autem eos, neque tempore fugit
          saepe molestias illo nobis a aliquam quas! Saepe ab consequatur illo,
          molestias ea, nulla nostrum, ipsum hic fuga quod sunt corrupti culpa
          cum adipisci necessitatibus vel qui illum nam ullam deserunt assumenda
          error quis? Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Deleniti amet, alias odio mollitia quae tenetur non optio eius
          pariatur ducimus quod tempora eligendi vero, facere minus laudantium
          molestiae ab a similique eveniet, nulla ipsa? Id vero illum, explicabo
          ipsam ullam blanditiis nemo accusantium amet architecto, recusandae
          voluptatem minus inventore harum aliquam aut deserunt cumque dolores
          fugiat quae labore beatae porro! Earum autem eos, neque tempore fugit
          saepe molestias illo nobis a aliquam quas! Saepe ab consequatur illo,
          molestias ea, nulla nostrum, ipsum hic fuga quod sunt corrupti culpa
          cum adipisci necessitatibus vel qui illum nam ullam deserunt assumenda
          error quis?
        </p>
      </div>
    </div>
  );
};

export default SavedListings;
