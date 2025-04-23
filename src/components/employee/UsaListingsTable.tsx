
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from 'lucide-react';

interface UsaListing {
  id: string;
  title: string;
  postedBy: string;
  postedAt: string;
  category: string;
  status: string;
  decision: string | null;
  decisionBy: string | null;
  decisionAt: string | null;
}

interface UsaListingsTableProps {
  usaListings: UsaListing[];
  isMobile: boolean;
  onVerifyUsaListing: (id: string) => void;
  onRejectUsaListing: (id: string) => void;
}

const UsaListingsTable: React.FC<UsaListingsTableProps> = ({
  usaListings,
  isMobile,
  onVerifyUsaListing,
  onRejectUsaListing
}) => {
  if (usaListings.length === 0) {
    return (
      <div className="text-center py-6">
        <p>No USA listings to verify</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {!isMobile && <TableHead>Posted By</TableHead>}
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usaListings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell className="font-medium">{listing.title}</TableCell>
              {!isMobile && <TableCell>{listing.postedBy}</TableCell>}
              <TableCell>{listing.category}</TableCell>
              <TableCell>
                <Badge variant={listing.status === 'Verified' ? 'success' : 'default'}>
                  {listing.status === 'Verified' ? 'Verified' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell className="space-x-2">
                {listing.status !== 'Verified' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onVerifyUsaListing(listing.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600"
                      onClick={() => onRejectUsaListing(listing.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsaListingsTable;
