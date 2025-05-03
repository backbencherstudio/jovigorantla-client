import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Flag, Eye, Ban, Trash2 } from "lucide-react";
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

interface FlaggedListing {
  id: string;
  listingId: string;
  listingTitle: string;
  category: string;
  reportedBy: string;
  reportedAt: string;
  decision?: string;
  decisionBy?: string;
  decisionAt?: string;
}

const FlaggedListings = () => {
  const [flaggedListings, setFlaggedListings] =
    useState<FlaggedListing[]>(mockFlaggedListings);
  const [flaggedHistory, setFlaggedHistory] =
    useState<FlaggedListing[]>(mockFlaggedHistory);
  const [showFlaggedHistory, setShowFlaggedHistory] = useState(false);
  const navigate = useNavigate();

  const handleDeleteListing = (id: string) => {
    const listing = flaggedListings.find((item) => item.id === id);
    if (listing) {
      const updatedListing = {
        ...listing,
        decision: "deleted",
        decisionBy: "admin@example.com",
        decisionAt: new Date().toISOString(),
      };

      setFlaggedHistory([updatedListing, ...flaggedHistory]);
      setFlaggedListings(
        flaggedListings.filter((listing) => listing.id !== id)
      );
      toast.success("Listing deleted successfully");
    }
  };

  const handleApproveListing = (id: string) => {
    const listing = flaggedListings.find((item) => item.id === id);
    if (listing) {
      const updatedListing = {
        ...listing,
        decision: "approved",
        decisionBy: "admin@example.com",
        decisionAt: new Date().toISOString(),
      };

      setFlaggedHistory([updatedListing, ...flaggedHistory]);
      setFlaggedListings(
        flaggedListings.filter((listing) => listing.id !== id)
      );
      toast.success("Listing approved and removed from flagged list");
    }
  };

  const handleBlockListing = (id: string) => {
    const listing = flaggedListings.find((item) => item.id === id);
    if (listing) {
      const updatedListing = {
        ...listing,
        decision: "blocked",
        decisionBy: "admin@example.com",
        decisionAt: new Date().toISOString(),
      };

      setFlaggedHistory([updatedListing, ...flaggedHistory]);
      setFlaggedListings(
        flaggedListings.filter((listing) => listing.id !== id)
      );
      toast.success("Listing blocked and removed from the platform");
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Flagged Listings</h2>
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
          {flaggedListings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Flag className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No flagged listings to review</p>
            </div>
          ) : (
            flaggedListings.map((listing) => (
              <Card
                key={listing.id}
                className="mb-4 cursor-pointer hover:shadow-md"
                onClick={() => handleViewListing(listing.listingId)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {listing.listingTitle}
                      </CardTitle>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
                        {listing.category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Reported {formatDate(listing.reportedAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <span className="font-medium text-sm">Reported by:</span>
                    <p className="text-gray-700">{listing.reportedBy}</p>
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
                        {item.listingTitle}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.reportedBy}</TableCell>
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
                          onClick={() => handleViewListing(item.listingId)}
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

export default FlaggedListings;
