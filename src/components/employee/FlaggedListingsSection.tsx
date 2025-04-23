
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from 'lucide-react';
import FlaggedListingsTable from './FlaggedListingsTable';
import FlaggedHistoryTable from './FlaggedHistoryTable';

interface FlaggedListingItem {
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

interface FlaggedHistoryItem {
  id: string;
  listingId: string;
  listingTitle: string;
  reportedBy: string;
  reportedAt: string;
  category: string;
  decision: string;
  decisionBy: string | null;
  decisionAt: string | null;
}

interface FlaggedListingsSectionProps {
  flaggedListings: FlaggedListingItem[];
  flaggedHistory: FlaggedHistoryItem[];
  showFlaggedHistory: boolean;
  setShowFlaggedHistory: (show: boolean) => void;
  formatDate: (dateString: string) => string;
  isMobile: boolean;
  onDeleteListing: (id: string) => void;
  onBlockListing: (id: string) => void;
  onApproveItem: (id: string) => void;
  onViewListing: (listingId: string) => void;
}

const FlaggedListingsSection: React.FC<FlaggedListingsSectionProps> = ({
  flaggedListings,
  flaggedHistory,
  showFlaggedHistory,
  setShowFlaggedHistory,
  formatDate,
  isMobile,
  onDeleteListing,
  onBlockListing,
  onApproveItem,
  onViewListing
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Flagged Listings</CardTitle>
          <CardDescription>
            Review listings that have been flagged by users for potential violations
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFlaggedHistory(!showFlaggedHistory)}
          className="flex items-center"
        >
          <History className="h-4 w-4 mr-2" />
          {showFlaggedHistory ? "Hide History" : "Show History"}
        </Button>
      </CardHeader>
      <CardContent>
        {!showFlaggedHistory ? (
          <FlaggedListingsTable 
            flaggedListings={flaggedListings}
            isMobile={isMobile}
            onDeleteListing={onDeleteListing}
            onBlockListing={onBlockListing}
            onApproveItem={onApproveItem}
            onViewListing={onViewListing}
          />
        ) : (
          <>
            <h3 className="font-medium text-lg mb-2">Decision History</h3>
            <FlaggedHistoryTable 
              flaggedHistory={flaggedHistory}
              formatDate={formatDate}
              onViewListing={onViewListing}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FlaggedListingsSection;
