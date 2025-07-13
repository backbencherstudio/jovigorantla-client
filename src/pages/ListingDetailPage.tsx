import React, { useEffect, useState } from "react";
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
import { formatCategory, formatSubCategory } from "@/lib/format";
import ListingActions from "@/components/ListingActions";


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

  const handleContact = async() => {
    try {
      if (user) {
        // console.log("user", user);
        // console.log(listing)

        // console.log({
        //   creator_id: user?.id,
        //   participant_id: listing?.user?.id,
        //   listing_id: listing?.id,
        // })

        const conversation = await api.post('/chat/conversation', {
          creator_id: user?.id,
          participant_id: listing?.user?.id,
          listing_id: listing?.id,
        })

        // console.log("conversation", conversation);

        if (conversation?.data?.success) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
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



  return (
    <div className="flex flex-col bg-white">
      {/* Listing content - make it scrollable but with room for the fixed button at bottom */}
      <div className="flex-1 py-[10px] overflow-y-auto pb-24 max-w-3xl mx-auto w-full">
        {/* Category, status and action buttons */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-500 text-sm gap-1">
            <span>{formatCategory(listing.category)}</span>
            <span className="mx-2">•</span>
            <span>{formatSubCategory(listing.category, listing.sub_category)}</span>
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
                openModal={() => {}}
          />

            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-4  line-2" style={{ lineHeight: 1.4}}>
            {listing.title}
            {/* Private accommodation available in Irving from August 1st for 2 males in 2bed 2bath */}
            </h1>

          {/* User info and metadata - updated format */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{listing?.user?.name}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(listing?.created_at)}</span>
            {listing?.address && (
              <>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <span>
                    {listing.address?.split(',').filter((_, i) => i === 0 || i === 1).join(', ')}
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
                src={listing.image_url}
                alt={listing.title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
            {/* <img src={`${listing.image_url}`} alt="listing" className="w-full h-[400px] object-cover rounded-lg" /> */}
        </div>
          )}

          {/* Description - only show if it exists */}
          {listing.description && (
            <Card className="mb-6 border-none shadow-none mt-4">
              <CardContent className="p-0">
                <h2 className="text-lg font-bold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {renderDescriptionWithPhoneLinks(listing.description)}
                </p>
              </CardContent>
            </Card>
          )}



          {/* <Card className="mb-6 border-none shadow-none">
              <CardContent className="p-0">
                <h2 className="text-lg font-bold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                🏠 Private Accommodation Available in Irving – 2BHK for 2 Males from August 1st

Looking for comfortable and private living in a great neighborhood? We’re offering a 2 bedroom, 2 bathroom apartment in Irving, Texas, available for 2 males starting August 1st. Whether you're a working professional or a student, this spacious and well-maintained home offers the privacy, convenience, and amenities you need for a comfortable stay.

Located in a peaceful and secure community, this apartment is ideal for individuals who value a clean and quiet living environment with easy access to major highways, public transportation, grocery stores, and restaurants.

🏡 Apartment Details:

– Type: 2 Bedroom | 2 Bathroom
– Availability: From August 1st
– Ideal for: 2 Males
– Rent: Competitive and affordable (Contact for details)
– Lease Type: Flexible (short-term/long-term options)

🛏️ Room Features:

– Private bedroom with closet space
– Attached and shared bathroom options
– Semi-furnished with essentials
– Natural lighting and good ventilation
– Carpeted/wood floors (based on unit)
– High-speed internet and utilities available

🍽️ Common Areas:

– Spacious living room with seating and TV setup
– Dining area for shared meals
– Fully-equipped kitchen with refrigerator, microwave, stove, and utensils
– Washer & Dryer in-unit or in-building

🌳 Community Amenities (Varies by complex):

– Swimming pool and gym access
– 24/7 maintenance and security patrol
– Designated parking spots
– Pet-friendly policy (check for details)
– Clubhouse and recreational areas

📍 Prime Location in Irving:

– Walking distance to Walmart, Indian groceries, and restaurants
– Quick access to DART station and bus lines
– Close to Las Colinas, DFW Airport, and major corporate hubs
– Peaceful neighborhood with parks and green spaces nearby

This accommodation is perfect for roommates, offering equal privacy in a shared 2BHK setup. Both bedrooms are designed to offer comfort and personal space, and bathrooms are conveniently located for easy access.

We’re looking for clean, respectful, and responsible individuals to occupy this space. Whether you're new to the city or simply looking for a better living option, this is a great opportunity to move into a welcoming and convenient environment.

📞 Contact Information:

If you’re interested or have any questions, please reach out for pictures, rent details, or to schedule a visit. Early applications are encouraged as availability may be limited.
                </p>
              </CardContent>
          </Card> */}


          

          {/* Photo Gallery - only show if there are images and not for jobs/rides */}

          
          
        </div>
        {/* Contact button - only show on desktop */}
        {!isMobile && user?.id !== listing?.user_id && (
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
      {isMobile && user?.id !== listing?.user_id && (
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
