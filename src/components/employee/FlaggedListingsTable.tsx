
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Ban, Flag, Check } from 'lucide-react';

interface FlaggedListing {
  id: string;
  listingId: string;
  listingTitle: string;
  reportedBy: string;
  reportedAt: string;
  category: string;
  userName?: string;
  decision: string | null;
  decisionBy: string | null;
  decisionAt: string | null;
}

interface FlaggedListingsTableProps {
  flaggedListings: FlaggedListing[];
  isMobile: boolean;
  onDeleteListing: (id: string) => void;
  onBlockListing: (id: string) => void;
  onApproveItem: (id: string) => void;
  onViewListing: (listingId: string) => void;
}

const FlaggedListingsTable: React.FC<FlaggedListingsTableProps> = ({
  flaggedListings,
  isMobile,
  onDeleteListing,
  onBlockListing,
  onApproveItem,
  onViewListing
}) => {
  if (flaggedListings.length === 0) {
    return (
      <div className="text-center py-6">
        <p>No flagged listings to review</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {!isMobile && <TableHead>User</TableHead>}
            <TableHead>Category</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flaggedListings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.listingTitle}</TableCell>
              {!isMobile && <TableCell>{listing.userName || "N/A"}</TableCell>}
              <TableCell>{listing.category}</TableCell>
              <TableCell>{listing.reportedBy}</TableCell>
              <TableCell className="space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onViewListing(listing.listingId)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onApproveItem(listing.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  onClick={() => onBlockListing(listing.id)}
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Block
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onDeleteListing(listing.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FlaggedListingsTable;
