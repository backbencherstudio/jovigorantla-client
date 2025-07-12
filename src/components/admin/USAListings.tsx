// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   History,
//   ListFilter,
//   Eye,
//   Check,
//   X,
//   Flag,
//   Ban,
//   Trash2,
// } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { mockUSAHistory, mockUSAListings } from "@/data/data";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";

// interface USAListing {
//   id: string;
//   title: string;
//   category: string;
//   postedBy: string;
//   postedAt: string;
//   status: "pending" | "approved" | "blocked";
//   decision?: string;
//   decisionBy?: string;
//   decisionAt?: string;
// }


// interface Listing {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   sub_category: string;
//   slug: string | null;
//   image: string | null;
//   image_url: string | null;
//   latitude: number;
//   longitude: number;
//   post_to_usa: boolean;
//   usa_listing_status: string | null;
//   flagged_listing_status: string
//   created_at: string; // ISO 8601 string
//   updated_at: string; // ISO 8601 string
//   user_id: string;
//   user: {
//     name: string;
//     email: string;
//   };
// }

// const USAListings = () => {
//   const [usaListings, setUsaListings] = useState(mockUSAListings);
//   const [usaHistory, setUsaHistory] = useState(mockUSAHistory);
//   const [showUsaHistory, setShowUsaHistory] = useState(false);

  
//   const navigate = useNavigate();

//   const handleApproveUSAListing = (id: string) => {
//     const listing = usaListings.find((item) => item.id === id);
//     if (listing) {
//       const updatedListing: USAListing = {
//         ...listing,
//         status: "approved" as const,
//         decision: "approved",
//         decisionBy: "admin@example.com",
//         decisionAt: new Date().toISOString(),
//       };

//       setUsaHistory([
//         {
//           id: updatedListing.id,
//           title: updatedListing.title,
//           postedBy: updatedListing.postedBy,
//           postedAt: updatedListing.postedAt,
//           category: updatedListing.category,
//           status: updatedListing.status,
//           decision: updatedListing.decision!,
//           decisionBy: updatedListing.decisionBy!,
//           decisionAt: updatedListing.decisionAt!,
//         },
//         ...usaHistory,
//       ]);
//       setUsaListings(usaListings.filter((listing) => listing.id !== id));
//       toast.success("USA listing approved and published");
//     }
//   };

//   const handleRejectUSAListing = (id: string) => {
//     const listing = usaListings.find((item) => item.id === id);
//     if (listing) {
//       const updatedListing: USAListing = {
//         ...listing,
//         status: "blocked" as const,
//         decision: "blocked",
//         decisionBy: "admin@example.com",
//         decisionAt: new Date().toISOString(),
//       };

//       setUsaHistory([
//         {
//           id: updatedListing.id,
//           title: updatedListing.title,
//           postedBy: updatedListing.postedBy,
//           postedAt: updatedListing.postedAt,
//           category: updatedListing.category,
//           status: updatedListing.status,
//           decision: updatedListing.decision!,
//           decisionBy: updatedListing.decisionBy!,
//           decisionAt: updatedListing.decisionAt!,
//         },
//         ...usaHistory,
//       ]);
//       setUsaListings(usaListings.filter((listing) => listing.id !== id));
//       toast.success("USA listing rejected. User will be notified.");
//     }
//   };

//   const handleViewListing = (listingId: string) => {
//     navigate(`/listing/${listingId}`);
//   };
//   const handleDeleteListing = (id: string) => {
//     const listing = usaListings.find((item) => item.id === id);
//     if (listing) {
//       const updatedListing = {
//         ...listing,
//         decision: "deleted",
//         decisionBy: "admin@example.com",
//         decisionAt: new Date().toISOString(),
//       };

//       setUsaHistory([updatedListing, ...usaHistory]);
//       setUsaListings(usaListings.filter((listing) => listing.id !== id));
//       toast.success("Listing deleted successfully");
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">USA Listings Approval</h2>
//         <Button
//           variant="outline"
//           onClick={() => setShowUsaHistory(!showUsaHistory)}
//           className="flex items-center"
//         >
//           <History className="h-4 w-4 mr-2" />
//           {showUsaHistory ? "Hide History" : "Show History"}
//         </Button>
//       </div>

//       {!showUsaHistory && (
//         <>
//           {usaListings.length === 0 ? (
//             <div className="text-center py-8 bg-gray-50 rounded-lg">
//               <Flag className="w-12 h-12 mx-auto text-gray-400 mb-2" />
//               <p className="text-gray-500">No USA listings to review</p>
//             </div>
//           ) : (
//             usaListings.map((listing) => (
//               <Card
//                 key={listing.id}
//                 className="mb-4 cursor-pointer hover:shadow-md"
//                 onClick={() => handleViewListing(listing.id)}
//               >
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <CardTitle className="text-lg">{listing.title}</CardTitle>
//                       <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
//                         {listing.category}
//                       </span>
//                     </div>
//                     <span className="text-sm text-gray-500">
//                       Reported {formatDate(listing.postedAt)}
//                     </span>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div>
//                     <span className="font-medium text-sm">Reported by:</span>
//                     <p className="text-gray-700">{listing.postedBy}</p>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-end space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleApproveUSAListing(listing.id);
//                     }}
//                   >
//                     <Eye className="h-4 w-4 mr-1" />
//                     Approve
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="text-[#bc0117] border-red-200 hover:bg-red-50"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRejectUSAListing(listing.id);
//                     }}
//                   >
//                     <Ban className="h-4 w-4 mr-1" />
//                     Block
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     className="bg-[#bc0117] text-white hover:bg-red-600"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDeleteListing(listing.id);
//                     }}
//                   >
//                     <Trash2 className="h-4 w-4 mr-1" />
//                     Delete
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))
//           )}
//         </>
//       )}

//       {showUsaHistory && (
//         <>
//           <h3 className="font-medium text-lg mb-2">Decision History</h3>
//           {usaHistory.length === 0 ? (
//             <div className="text-center py-8 bg-gray-50 rounded-lg">
//               <History className="w-12 h-12 mx-auto text-gray-400 mb-2" />
//               <p className="text-gray-500">No decision history available</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto max-w-[90vw]">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Title</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Posted By</TableHead>
//                     <TableHead>Decision</TableHead>
//                     <TableHead>Decision Date</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {usaHistory.map((item) => (
//                     <TableRow key={item.id}>
//                       <TableCell className="font-medium">
//                         {item.title}
//                       </TableCell>
//                       <TableCell>{item.category}</TableCell>
//                       <TableCell>{item.postedBy}</TableCell>
//                       <TableCell>
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs ${
//                             item.decision === "approved"
//                               ? "bg-green-100 text-green-800"
//                               : item.decision === "blocked"
//                               ? "bg-orange-100 text-orange-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {item.decision?.charAt(0).toUpperCase() +
//                             item.decision?.slice(1)}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         {item.decisionAt ? formatDate(item.decisionAt) : "-"}
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleViewListing(item.id)}
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default USAListings;


import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Flag, Eye, Ban, Trash2, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockFlaggedListings, mockFlaggedHistory } from "@/data/data";
import { api } from "@/lib/axois";
import { formatCategory } from "@/lib/format";

// interface FlaggedListingHisotry {
//   id: string;
//   listingId: string;
//   listingTitle: string;
//   category: string;
//   reportedBy: string;
//   reportedAt: string;
//   decision?: string;
//   decisionBy?: string;
//   decisionAt?: string;
// }

interface FlaggedListing {
  id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string;
  slug: string | null;
  image: string | null;
  image_url: string | null;
  latitude: number;
  longitude: number;
  post_to_usa: boolean;
  usa_listing_status: string | null;
  flagged_listing_status: string
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  user_id: string;
  user: {
    name: string;
    email: string;
  };
}


const USAListing = () => {
  const [flaggedListings, setFlaggedListings] =
    useState<FlaggedListing[]>();
  const [flaggedHistory, setFlaggedHistory] =
    useState<FlaggedListing[]>();
  const [showFlaggedHistory, setShowFlaggedHistory] = useState(false);
  const navigate = useNavigate();

  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);



  const [historyCursor, setHistoryCursor] = useState<string | null>(null);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  // console.log(flaggedListings)

  const handleDeleteListing = async (id: string) => {
    try {
      const response = await api.patch(`/admin/listings/usa-listings/${id}/deleted`);

      if(!response?.data?.success){
        throw Error(response.data.message);
      }

      const listing = flaggedListings.find((item) => item.id === id);
      if (listing) {
        const updatedListing = {
          ...listing,
          usa_listing_status: "DELETED",
          updated_at: new Date().toISOString(),
        };

        setFlaggedHistory([updatedListing, ...flaggedHistory]);
        setFlaggedListings(
          flaggedListings.filter((listing) => listing.id !== id)
        );
        toast.success("Listing deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const handleApproveListing = async (id: string) => {
    try {
      const response = await api.patch(`/admin/listings/usa-listings/${id}/approved`);

      if(!response?.data?.success){
        throw Error(response.data.message);
      }

      const listing = flaggedListings.find((item) => item.id === id);
      if (listing) {
        const updatedListing = {
          ...listing,
          usa_listing_status: "APPROVED",
          updated_at: new Date().toISOString(),
        };
  
        setFlaggedHistory([updatedListing, ...flaggedHistory]);
        setFlaggedListings(
          flaggedListings.filter((listing) => listing.id !== id)
        );
        toast.success("Listing approved and removed from flagged list");
      }
    } catch (error) {
      console.error("Error approving listing:", error);
      toast.error("Failed to approve listing");
    }
   
  };

  const handleBlockListing = async(id: string) => {
    try {
      const response = await api.patch(`/admin/listings/usa-listings/${id}/blocked`);

      if(!response?.data?.success){
        throw Error(response.data.message);
      }
      const listing = flaggedListings.find((item) => item.id === id);
      if (listing) {
        const updatedListing = {
          ...listing,
          usa_listing_status: "BLOCKED",
          updated_at: new Date().toISOString(),
        };

        setFlaggedHistory([updatedListing, ...flaggedHistory]);
        setFlaggedListings(
          flaggedListings.filter((listing) => listing.id !== id)
        );
        toast.success("Listing blocked and removed from the platform");
      }
      
    } catch (error) {
      toast.error("Failed to block listing");
    }
  };

  const handleViewListing = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const fetchFlaggedListings = useCallback(async (cursor?: string) => {
    try {
      let response: any;
      if (cursor) {
        const {data} = await api.get(`/admin/listings/usa-listings?cursor=${cursor}`);
        response = data;
      } else {
        const { data } = await api.get("/admin/listings/usa-listings");
        response = data;
      }

      if (response?.data) {
        // setFlaggedListings((prev) => [...(prev || []), ...response.data]);

        setFlaggedListings((prev) => {
          const existingIds = new Set((prev || []).map(item => item.id));
          const newItems = response.data.filter(item => !existingIds.has(item.id));
          return [...(prev || []), ...newItems];
        });
        setHasNextPage(response.hasNextPage);
        setNextCursor(response.nextCursor);
      }
    } catch (error) {
      toast.error("Failed to fetch flagged listings");
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchFlaggedHistory = useCallback(async (cursor?: string) => {
    try {
      let response: any;
  
      if (cursor) {
        const { data } = await api.get(`/admin/listings/usa-listings-history?cursor=${cursor}&limit=6`);
        response = data;
      } else {
        const { data } = await api.get("/admin/listings/usa-listings-history?limit=6");
        response = data;
      }
      
  
      if (response?.data) {
        setFlaggedHistory((prev) => {
          const existingIds = new Set((prev || []).map(item => item.id));
          const newItems = response.data.filter(item => !existingIds.has(item.id));
          return [...(prev || []), ...newItems];
        });
  
        setHasMoreHistory(response.hasNextPage);
        setHistoryCursor(response.nextCursor);
      }
    } catch (error) {
      toast.error("Failed to fetch flagged history");
    } finally {
      setIsFetchingHistory(false);
    }
  }, []);


  const reverseUSAHistory = async (listingId) => {
    console.log(listingId)
  }
  

  useEffect(() => {
    fetchFlaggedListings();
    fetchFlaggedHistory();
  }, []);


  // // Set up Intersection Observer to trigger load when user scrolls to the bottom
  // const observer = new IntersectionObserver(
  //   (entries) => {
  //     const entry = entries[0];
  //     if (entry.isIntersecting && hasNextPage && !isFetching) {
  //       setIsFetching(true);
  //       fetchFlaggedListings(nextCursor).finally(() => setIsFetching(false));
  //     }
  //   },
  //   {
  //     rootMargin: "100px", // You can adjust this to trigger a bit earlier or later
  //   }
  // );

  useEffect(() => {

    
    if (!hasNextPage) return; // If there's no next page, don't observe
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching) {
          setIsFetching(true);
          fetchFlaggedListings(nextCursor).finally(() => setIsFetching(false)); // Fetch the next page
        }
      },
      {
        rootMargin: "100px", // Trigger loading a bit before reaching the end
      }
    );
  
    const target = document.getElementById("load-more-trigger");
    if (target) observer.observe(target);
  
    // Cleanup the observer when the component unmounts or nextCursor changes
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasNextPage, nextCursor, isFetching]); // Re-run when nextCursor or hasNextPage changes
  
  useEffect(() => {
    if (!showFlaggedHistory) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMoreHistory && !isFetchingHistory) {
          setIsFetchingHistory(true);
          fetchFlaggedHistory(historyCursor).finally(() => {
            setIsFetchingHistory(false);
          });
        }
      },
      {
        rootMargin: "100px",
      }
    );
  
    const target = document.getElementById("load-more-history-trigger");
    if (target) observer.observe(target);
  
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [showFlaggedHistory, hasMoreHistory, historyCursor, isFetchingHistory, fetchFlaggedHistory]);

  // console.log(flaggedListings);
  // console.log(flaggedHistory);
  
  // useEffect(() => {
  //   const ids = flaggedListings?.map(i => i.id);
  //   const unique = new Set(ids);
  //   if (ids?.length !== unique?.size) {
  //     console.warn("Duplicate IDs in listings:", ids);
  //   }
  // }, [flaggedListings]);



  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">USA Listings Approval</h2>
        <Button
          variant="outline"
          onClick={() => setShowFlaggedHistory(!showFlaggedHistory)}
          className="flex items-center"
        >
          <History className="h-4 w-4 mr-2" />
          {showFlaggedHistory ? "Hide History" : "Show History"}
        </Button>
      </div>

      {!showFlaggedHistory && (
        <>
          {flaggedListings?.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Flag className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No flagged listings to review</p>
            </div>
          ) : (
            flaggedListings?.map((listing) => (
              <Card
                key={listing.id}
                className="mb-4 cursor-pointer hover:shadow-md"
                onClick={() => handleViewListing(listing.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {listing.title}
                      </CardTitle>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
                        {formatCategory(listing.category)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                    Submit on {formatDate(listing.created_at)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium text-sm">Submitted by:</span>
                    <p className="text-gray-700">{listing.user.email}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveListing(listing.id);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#bc0117] border-red-200 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlockListing(listing.id);
                    }}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Block
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-[#bc0117] text-white hover:bg-red-600"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteListing(listing.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}

          {hasNextPage && !isFetching && (
            <div id="load-more-trigger" className="h-4"></div> // This div will be observed
          )}

          {isFetching && <div className="text-center">Loading more...</div>}

        </>
      )}

      {showFlaggedHistory && (
        <>
          <h3 className="font-medium text-lg mb-2">Decision History</h3>
          {flaggedHistory.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <History className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No decision history available</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-w-[90vw]">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Decision Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell className="break-all">{formatCategory(item.category)}</TableCell>
                      <TableCell
                      className="break-all"
                      >{item.user.email}</TableCell>
                      <TableCell >
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${item.usa_listing_status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : item.usa_listing_status === "BLOCKED"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {item.usa_listing_status?.charAt(0).toUpperCase() +
                            item.usa_listing_status?.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.updated_at ? formatDate(item.updated_at) : "-"}
                      </TableCell>
                      {/* <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewListing(item.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell> */}
                      <TableCell className="flex gap-1">
                       
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => handleViewListing(item.id)}
                       >
                         <Eye className="h-3 w-3" />
                         {/* View */}
                       </Button>

                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => reverseUSAHistory(item.id)}
                       >
                         <SquarePen className="h-3 w-3" />
                       </Button>
                     </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

      {hasMoreHistory && (
        <div id="load-more-history-trigger" className="h-6"></div>
      )}

      {isFetchingHistory && (
        <div className="text-center py-4 text-gray-500 text-sm">Loading more history...</div>
      )}
        </>
      )}
    </div>
  );
};

export default USAListing;
