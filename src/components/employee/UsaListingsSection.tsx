
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from 'lucide-react';
import UsaListingsTable from './UsaListingsTable';
import UsaHistoryTable from './UsaHistoryTable';

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

interface UsaHistoryItem {
  id: string;
  title: string;
  postedBy: string;
  postedAt: string;
  category: string;
  status: string;
  decision: string;
  decisionBy: string;
  decisionAt: string;
}

interface UsaListingsSectionProps {
  usaListings: UsaListing[];
  usaHistory: UsaHistoryItem[];
  showUsaHistory: boolean;
  setShowUsaHistory: (show: boolean) => void;
  formatDate: (dateString: string) => string;
  isMobile: boolean;
  onVerifyUsaListing: (id: string) => void;
  onRejectUsaListing: (id: string) => void;
}

const UsaListingsSection: React.FC<UsaListingsSectionProps> = ({
  usaListings,
  usaHistory,
  showUsaHistory,
  setShowUsaHistory,
  formatDate,
  isMobile,
  onVerifyUsaListing,
  onRejectUsaListing
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>USA Listings</CardTitle>
          <CardDescription>
            Verify listings that are marked as located in the United States
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowUsaHistory(!showUsaHistory)}
          className="flex items-center"
        >
          <History className="h-4 w-4 mr-2" />
          {showUsaHistory ? "Hide History" : "Show History"}
        </Button>
      </CardHeader>
      <CardContent>
        {!showUsaHistory ? (
          <UsaListingsTable 
            usaListings={usaListings}
            isMobile={isMobile}
            onVerifyUsaListing={onVerifyUsaListing}
            onRejectUsaListing={onRejectUsaListing}
          />
        ) : (
          <>
            <h3 className="font-medium text-lg mb-2">Decision History</h3>
            <UsaHistoryTable 
              usaHistory={usaHistory}
              formatDate={formatDate}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UsaListingsSection;
