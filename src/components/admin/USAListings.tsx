import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  History,
  ListFilter,
  Eye,
  Check,
  X,
  Flag,
  Ban,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockUSAHistory, mockUSAListings } from "@/data/data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface USAListing {
  id: string;
  title: string;
  category: string;
  postedBy: string;
  postedAt: string;
  status: "pending" | "approved" | "blocked";
  decision?: string;
  decisionBy?: string;
  decisionAt?: string;
}

const USAListings = () => {
  const [usaListings, setUsaListings] = useState(mockUSAListings);
  const [usaHistory, setUsaHistory] = useState(mockUSAHistory);
  const [showUsaHistory, setShowUsaHistory] = useState(false);
  const navigate = useNavigate();

  const handleApproveUSAListing = (id: string) => {
    const listing = usaListings.find((item) => item.id === id);
    if (listing) {
      const updatedListing: USAListing = {
        ...listing,
        status: "approved" as const,
        decision: "approved",
        decisionBy: "admin@example.com",
        decisionAt: new Date().toISOString(),
      };

      setUsaHistory([
        {
          id: updatedListing.id,
          title: updatedListing.title,
          postedBy: updatedListing.postedBy,
          postedAt: updatedListing.postedAt,
          category: updatedListing.category,
          status: updatedListing.status,
          decision: updatedListing.decision!,
          decisionBy: updatedListing.decisionBy!,
          decisionAt: updatedListing.decisionAt!,
        },
        ...usaHistory,
      ]);
      setUsaListings(usaListings.filter((listing) => listing.id !== id));
      toast.success("USA listing approved and published");
    }
  };

  const handleRejectUSAListing = (id: string) => {
    const listing = usaListings.find((item) => item.id === id);
    if (listing) {
      const updatedListing: USAListing = {
        ...listing,
        status: "blocked" as const,
        decision: "blocked",
        decisionBy: "admin@example.com",
        decisionAt: new Date().toISOString(),
      };

      setUsaHistory([
        {
          id: updatedListing.id,
          title: updatedListing.title,
          postedBy: updatedListing.postedBy,
          postedAt: updatedListing.postedAt,
          category: updatedListing.category,
          status: updatedListing.status,
          decision: updatedListing.decision!,
          decisionBy: updatedListing.decisionBy!,
          decisionAt: updatedListing.decisionAt!,
        },
        ...usaHistory,
      ]);
      setUsaListings(usaListings.filter((listing) => listing.id !== id));
      toast.success("USA listing rejected. User will be notified.");
    }
  };

  const handleViewListing = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };
  const handleDeleteListing = (id: string) => {
    const listing = usaListings.find((item) => item.id === id);
    if (listing) {
      const updatedListing = {
        ...listing,
        decision: "deleted",
        decisionBy: "admin@example.com",
        decisionAt: new Date().toISOString(),
      };

      setUsaHistory([updatedListing, ...usaHistory]);
      setUsaListings(usaListings.filter((listing) => listing.id !== id));
      toast.success("Listing deleted successfully");
    }
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">USA Listings Approval</h2>
        <Button
          variant="outline"
          onClick={() => setShowUsaHistory(!showUsaHistory)}
          className="flex items-center"
        >
          <History className="h-4 w-4 mr-2" />
          {showUsaHistory ? "Hide History" : "Show History"}
        </Button>
      </div>

      {!showUsaHistory && (
        <>
          {usaListings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Flag className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No USA listings to review</p>
            </div>
          ) : (
            usaListings.map((listing) => (
              <Card
                key={listing.id}
                className="mb-4 cursor-pointer hover:shadow-md"
                onClick={() => handleViewListing(listing.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
                        {listing.category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Reported {formatDate(listing.postedAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium text-sm">Reported by:</span>
                    <p className="text-gray-700">{listing.postedBy}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveUSAListing(listing.id);
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
                      handleRejectUSAListing(listing.id);
                    }}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Block
                  </Button>
                  <Button
                    variant="destructive"
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
        </>
      )}

      {showUsaHistory && (
        <>
          <h3 className="font-medium text-lg mb-2">Decision History</h3>
          {usaHistory.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <History className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No decision history available</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-w-[90vw]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Decision Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usaHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.postedBy}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.decision === "approved"
                              ? "bg-green-100 text-green-800"
                              : item.decision === "blocked"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.decision?.charAt(0).toUpperCase() +
                            item.decision?.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.decisionAt ? formatDate(item.decisionAt) : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewListing(item.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default USAListings;
