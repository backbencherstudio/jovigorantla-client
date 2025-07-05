// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Star, MoreVertical, Share2, EyeOff, Flag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";
// import { useAuth } from "@/context/AuthContext";
// import { useListing } from "@/context/ListingContext";

// interface ListingActionsProps {
//   listingId: string;
//   listingTitle: string;
//   // saved: boolean;
//   onToggleSave: (e: React.MouseEvent, id: string) => void;
// }

// const ListingActions = ({
//   listingId,
//   listingTitle,
//   // saved,
//   onToggleSave,
// }: ListingActionsProps) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [saved, setSaved] = useState(false);
//   const { favoritesListings, addFavoritesListing, deleteFavoritesListing } = useAuth();
//   const { hideListing } = useListing();
//   const location = useLocation();
//   const isOnListingPage = location.pathname.startsWith("/listing");
//   const [showReportModal, setShowReportModal] = useState(false);

  
//   // console.log("favoritesListings => ", favoritesListings);

//   useEffect(() => {
//     if (user) {
//       // check if listing is in favoritesListings
//       if (favoritesListings.find(value => value.id === listingId)) {
//         setSaved(true);
//       } else {
//         setSaved(false);
//       }
//     }
//   }, [user, listingId]);

//   const handleListingAction = (e: React.MouseEvent, action: string) => {
//     e.stopPropagation();

//     switch (action) {
//       case "share":
//         // Use Web Share API if available, otherwise copy to clipboard
//         if (navigator.share) {
//           navigator.share({
//             title: listingTitle,
//             text: `Check out this listing: ${listingTitle}`,
//             url: `${window.location.origin}/listing/${listingId}`,
//           });
//         } else {
//           navigator.clipboard.writeText(
//             `${window.location.origin}/listing/${listingId}`
//           );
//           toast.success("Link copied to clipboard");
//         }
//         break;
//       case "hide":
       
//         hideListing(listingId);
//         break;
//       case "report":
//         e.preventDefault(); // just in case
//         e.stopPropagation(); // ✅ important
//         setShowReportModal(true);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleToggleSave = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (user) {
//       if (saved) {
//         deleteFavoritesListing(listingId);
//       } else {
//         addFavoritesListing(listingId);
//       }
//       setSaved(!saved);
//     } else {
//       toast.error("You must be logged in to save a listing");
//     }
//   };

//   // useEffect(() => {
//   //   if (user) {
//   //     // check if listing is in favoritesListings
//   //     if (favoritesListings.find(value => value.id === listingId)) {
//   //       console.log("listing is in favoritesListings");
//   //       setSaved(true);
//   //     } else {
//   //       setSaved(false);
//   //     }
//   //   }
//   // }, []);

//   return (
//     <div className="flex items-center  ">
//       <Button
//         variant="ghost"
//         size="sm"
//         className="h-8 w-8 p-0"
//         type="button"
//         onClick={(e) => {
//           onToggleSave(e, listingId)
//           handleToggleSave(e);
//         }}
//       >
//         <Star
//           className={`h-5 w-5 ${
//             saved ? "fill-[#ff6b00] text-[#ff6b00]" : "text-gray-400"
//           }`}
//         />
//       </Button>

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//             <MoreVertical className="h-5 w-5 text-gray-400" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="bg-white">
//           <DropdownMenuItem onClick={(e) => handleListingAction(e, "share")}>
//             <Share2 className="h-4 w-4 mr-2" />
//             <span>Share</span>
//           </DropdownMenuItem>
//           {/* <DropdownMenuItem onClick={(e) => handleListingAction(e, "hide")}>
//             <EyeOff className="h-4 w-4 mr-2" />
//             <span>Hide</span>
//           </DropdownMenuItem> */}
//           {!isOnListingPage && (
//   <DropdownMenuItem onClick={(e) => handleListingAction(e, "hide")}>
//     <EyeOff className="h-4 w-4 mr-2" />
//     <span>Hide</span>
//   </DropdownMenuItem>
// )}
//           <DropdownMenuItem onClick={(e) => handleListingAction(e, "report")}>
//             <Flag className="h-4 w-4 mr-2" />
//             <span>Report</span>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {showReportModal && (
//   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg z-100">
//       <h2 className="text-lg font-semibold mb-4">Report Listing</h2>
//       <p className="text-sm text-gray-600 mb-4">
//         Are you sure you want to report this listing?
//       </p>
//       <div className="flex justify-end gap-3">
//         <Button variant="outline" onClick={() => setShowReportModal(false)}>
//           Cancel
//         </Button>
//         <Button
//           variant="destructive"
//           onClick={(e) => {
//             e.stopPropagation()
//             setShowReportModal(false);
//           }}
//         >
//           Report
//         </Button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default ListingActions;


// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Star, MoreVertical, Share2, EyeOff, Flag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";
// import { useAuth } from "@/context/AuthContext";
// import { useListing } from "@/context/ListingContext";

// interface ListingActionsProps {
//   listingId: string;
//   listingTitle: string;
//   onToggleSave: (e: React.MouseEvent, id: string) => void;
// }

// const ListingActions = ({
//   listingId,
//   listingTitle,
//   onToggleSave,
// }: ListingActionsProps) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [saved, setSaved] = useState(false);
//   const { favoritesListings, addFavoritesListing, deleteFavoritesListing } = useAuth();
//   const { hideListing } = useListing();
//   const location = useLocation();
//   const isOnListingPage = location.pathname.startsWith("/listing");
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setSaved(favoritesListings.some(listing => listing.id === listingId));
//     }
//   }, [user, listingId, favoritesListings]);

//   const handleListingAction = (e: React.MouseEvent, action: string) => {
//     e.stopPropagation();
//     e.preventDefault();

//     switch (action) {
//       case "share":
//         if (navigator.share) {
//           navigator.share({
//             title: listingTitle,
//             text: `Check out this listing: ${listingTitle}`,
//             url: `${window.location.origin}/listing/${listingId}`,
//           });
//         } else {
//           navigator.clipboard.writeText(
//             `${window.location.origin}/listing/${listingId}`
//           );
//           toast.success("Link copied to clipboard");
//         }
//         setDropdownOpen(false);
//         break;
//       case "hide":
//         hideListing(listingId);
//         setDropdownOpen(false);
//         break;
//       case "report":
//         setShowReportModal(true);
//         setDropdownOpen(false);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleToggleSave = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (user) {
//       if (saved) {
//         deleteFavoritesListing(listingId);
//       } else {
//         addFavoritesListing(listingId);
//       }
//       setSaved(!saved);
//     } else {
//       toast.error("You must be logged in to save a listing");
//     }
//   };

//   const closeReportModal = (e?: React.MouseEvent) => {
//     if (e) {
//       e.stopPropagation();
//     }
//     setShowReportModal(false);
//   };

//   const handleReportListing = (e) => {
//     // handle report logic
//     if (e) {
//       e.stopPropagation();
//     }
//     setShowReportModal(false);
//   };

//   return (
//     <div className="flex items-center">
//       <Button
//         variant="ghost"
//         size="sm"
//         className="h-8 w-8 p-0"
//         type="button"
//         onClick={(e) => {
//           onToggleSave(e, listingId);
//           handleToggleSave(e);
//         }}
//       >
//         <Star
//           className={`h-5 w-5 ${
//             saved ? "fill-[#ff6b00] text-[#ff6b00]" : "text-gray-400"
//           }`}
//         />
//       </Button>

//       <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//             <MoreVertical className="h-5 w-5 text-gray-400" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="bg-white">
//           <DropdownMenuItem 
//             onClick={(e) => handleListingAction(e, "share")}
//             onSelect={(e) => e.preventDefault()}
//           >
//             <Share2 className="h-4 w-4 mr-2" />
//             <span>Share</span>
//           </DropdownMenuItem>
//           {!isOnListingPage && (
//             <DropdownMenuItem 
//               onClick={(e) => handleListingAction(e, "hide")}
//               onSelect={(e) => e.preventDefault()}
//             >
//               <EyeOff className="h-4 w-4 mr-2" />
//               <span>Hide</span>
//             </DropdownMenuItem>
//           )}
//           <DropdownMenuItem 
//             onClick={(e) => handleListingAction(e, "report")}
//             onSelect={(e) => e.preventDefault()}
//           >
//             <Flag className="h-4 w-4 mr-2" />
//             <span>Report</span>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {showReportModal && (
//         <div 
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//           onClick={closeReportModal}
//         >
//           <div 
//             className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg z-100"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-lg font-semibold mb-4">Report Listing</h2>
//             <p className="text-sm text-gray-600 mb-4">
//               Are you sure you want to report this listing?
//             </p>
//             <div className="flex justify-end gap-3">
//               <Button variant="outline" onClick={closeReportModal}>
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={closeReportModal}
//               >
//                 Report
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListingActions;

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, MoreVertical, Share2, EyeOff, Flag, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useListing } from "@/context/ListingContext";
import { api } from "@/lib/axois";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "./AuthModal";
import { createPortal } from 'react-dom';


interface ListingActionsProps {
  listingId: string;
  isUsa: boolean;
  listingTitle: string;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onHide: () => void;
  openModal: () => void;
}

const ListingActions = ({
  listingId,
  isUsa,
  listingTitle,
  onToggleSave,
  onHide,
  openModal,
}: ListingActionsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const { favoritesListings, addFavoritesListing, deleteFavoritesListing } = useAuth();
  // const { hideListing } = useListing();
  const location = useLocation();
  const isOnListingPage = location.pathname.startsWith("/listing") || location.pathname.startsWith("/saved-listings");
  const [showReportModal, setShowReportModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ModalPortal = ({ children }) => {
    return createPortal(children, document.body);
  };

  useEffect(() => {
    if (user) {
      setSaved(favoritesListings.some(listing => listing.id === listingId));
    }
  }, [user, listingId, favoritesListings]);

  const handleListingAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    e.preventDefault();

    switch (action) {
      case "share":
        if (navigator.share) {
          navigator.share({
            title: listingTitle,
            text: `Check out this listing: ${listingTitle}`,
            url: `${window.location.origin}/listing/${listingId}`,
          });
        } else {
          navigator.clipboard.writeText(
            `${window.location.origin}/listing/${listingId}`
          );
          toast.success("Link copied to clipboard");
        }
        setDropdownOpen(false);
        break;
      case "hide":
        // hideListing(listingId);
        onHide();
        setDropdownOpen(false);
        break;
      case "report":
        if (!user) {
          openModal()
          break;
        }
        setShowReportModal(true);
        setDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      if (saved) {
        deleteFavoritesListing(listingId);
      } else {
        addFavoritesListing(listingId);
      }
      setSaved(!saved);
    } else {
      console.log('clicked')
      openModal()
    }
  };

  const handleReportListing = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setReportStatus("loading");

    try {
     
      let response: any
      if(isUsa){
        response = await api.post(`/listings/${listingId}/report`, {
          report_type: 'POST_TO_USA'
        })
      }else{
        response =await api.post(`/listings/${listingId}/report`, {
          report_type: 'NORMAL'
        })
      }
      
      console.log(response)

     
      // Mock success response
    setReportStatus("success");
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowReportModal(false);
      setReportStatus("idle");
    }, 2000);
      
     

    } catch (error) {
      console.error("Error reporting listing:", error);
      setReportStatus("error");
    }
  };

  const closeReportModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowReportModal(false);
    setReportStatus("idle");
  };

  // if(!user)return null;
  

  return (
    <>
    
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        type="button"
        onClick={(e) => {
          onToggleSave(e, listingId);
          handleToggleSave(e);
        }}
      >
        <Star
          className={`h-5 w-5 ${
            saved ? "fill-[#ff6b00] text-[#ff6b00]" : "text-gray-400"
          }`}
        />
      </Button>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem 
            onClick={(e) => handleListingAction(e, "share")}
            onSelect={(e) => e.preventDefault()}
          >
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share</span>
          </DropdownMenuItem>
          {!isOnListingPage && (
            <DropdownMenuItem 
              onClick={(e) => handleListingAction(e, "hide")}
              onSelect={(e) => e.preventDefault()}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              <span>Hide</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={(e) => handleListingAction(e, "report")}
            onSelect={(e) => e.preventDefault()}
          >
            <Flag className="h-4 w-4 mr-2" />
            <span>Report</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showReportModal && (
        <ModalPortal>

        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={closeReportModal}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg z-[1001]"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }
            }
          >
            {reportStatus === "success" ? (
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-lg font-semibold mb-2">Report Submitted</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Thank you for helping improve our community.
                </p>
                <Button 
                  onClick={closeReportModal}
                  className="mt-2"
                >
                  Close
                </Button>
              </div>
            ) : reportStatus === "error" ? (
              <div className="flex flex-col items-center text-center">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-lg font-semibold mb-2">Report Failed</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Please try again later.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={closeReportModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReportListing}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">Report Listing</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to report this listing?
                </p>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={closeReportModal}
                    disabled={reportStatus === "loading"}
                  >
                    Cancel
                  </Button>
                  <Button
                    // variant="destructive"
                    onClick={handleReportListing}
                    disabled={reportStatus === "loading"}
                  >
                    {reportStatus === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Reporting...
                      </>
                    ) : "Report"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        </ModalPortal>
      )}
    </div>

    {/* <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab as "login" | "signup"}
      /> */}
    </>
  );
};

export default ListingActions;