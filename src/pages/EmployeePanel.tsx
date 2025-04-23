import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/use-media-query';
import FlaggedListingsSection from '@/components/employee/FlaggedListingsSection';
import UsaListingsSection from '@/components/employee/UsaListingsSection';
import { X } from 'lucide-react'; // Added missing import

// Mock data for flagged listings
const mockFlaggedListings = [
  {
    id: "1",
    listingId: "listing-101",
    listingTitle: "2BR Apartment Near Campus - Utilities Included",
    reportedBy: "user123@example.com",
    reportedAt: "2023-09-15T14:30:00",
    category: "Accommodations",
    decision: null,
    decisionBy: null,
    decisionAt: null
  },
  {
    id: "2",
    listingId: "listing-102",
    listingTitle: "Junior Developer Position - Remote Friendly",
    reportedBy: "jane_doe@example.com",
    reportedAt: "2023-09-14T09:45:00",
    category: "Jobs",
    decision: null,
    decisionBy: null,
    decisionAt: null
  },
  {
    id: "3",
    listingId: "listing-103",
    listingTitle: "MacBook Pro 2022 - Like New Condition",
    reportedBy: "security_team@example.com",
    reportedAt: "2023-09-13T16:20:00",
    category: "Marketplace",
    decision: null,
    decisionBy: null,
    decisionAt: null
  }
];

// History of decisions for flagged listings
const mockFlaggedHistory = [
  {
    id: "flagged-history-1",
    listingId: "listing-104",
    listingTitle: "iPhone 13 Pro Max - Mint Condition",
    reportedBy: "moderator@example.com",
    reportedAt: "2023-09-10T11:20:00",
    category: "Marketplace",
    decision: "approved",
    decisionBy: "admin@example.com",
    decisionAt: "2023-09-11T09:15:00"
  },
  {
    id: "flagged-history-2",
    listingId: "listing-105",
    listingTitle: "Roommate Wanted - Shared Apartment",
    reportedBy: "user456@example.com",
    reportedAt: "2023-09-09T16:35:00",
    category: "Accommodations",
    decision: "blocked",
    decisionBy: "admin@example.com",
    decisionAt: "2023-09-09T17:30:00"
  },
  {
    id: "flagged-history-3",
    listingId: "listing-106",
    listingTitle: "Part-time Bartender Needed",
    reportedBy: "community_watch@example.com",
    reportedAt: "2023-09-08T14:10:00",
    category: "Jobs",
    decision: "deleted",
    decisionBy: "admin@example.com",
    decisionAt: "2023-09-08T15:45:00"
  }
];

// Mock data for USA listings pending approval
const mockUSAListings = [
  {
    id: "usa1",
    title: "Software Developer position at Tech Corp",
    postedBy: "tech_recruiter@example.com",
    postedAt: "2023-09-10T11:30:00",
    category: "Jobs",
    status: "pending",
    decision: null,
    decisionBy: null,
    decisionAt: null
  },
  {
    id: "usa2",
    title: "Freelance Web Design Services Available",
    postedBy: "designer@example.com",
    postedAt: "2023-09-11T14:45:00", 
    category: "Marketplace",
    status: "pending",
    decision: null,
    decisionBy: null,
    decisionAt: null
  },
  {
    id: "usa3",
    title: "Tutoring Services for Computer Science",
    postedBy: "tutor@example.com",
    postedAt: "2023-09-12T09:15:00",
    category: "Marketplace",
    status: "pending",
    decision: null,
    decisionBy: null,
    decisionAt: null
  }
];

// History of USA listing decisions
const mockUSAHistory = [
  {
    id: "usa-history-1",
    title: "Math Tutoring Services",
    postedBy: "math_expert@example.com",
    postedAt: "2023-09-05T10:30:00",
    category: "Marketplace",
    status: "approved",
    decision: "approved",
    decisionBy: "admin@example.com",
    decisionAt: "2023-09-06T11:20:00"
  },
  {
    id: "usa-history-2",
    title: "Frontend Developer at Startup",
    postedBy: "startup_recruiter@example.com",
    postedAt: "2023-09-07T14:15:00",
    category: "Jobs",
    status: "rejected",
    decision: "rejected",
    decisionBy: "admin@example.com",
    decisionAt: "2023-09-08T09:45:00"
  }
];

const EmployeePanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  
  const [flaggedListings, setFlaggedListings] = useState(mockFlaggedListings);
  const [flaggedHistory, setFlaggedHistory] = useState(mockFlaggedHistory);
  const [showFlaggedHistory, setShowFlaggedHistory] = useState(false);
  const [usaListings, setUsaListings] = useState(mockUSAListings);
  const [usaHistory, setUsaHistory] = useState(mockUSAHistory);
  const [showUsaHistory, setShowUsaHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("flagged");
  
  // Check if user is employee or admin
  useEffect(() => {
    console.log("Auth check - Current user:", user);
    
    // This is a placeholder for real authentication logic
    // In a real app, you would check if the user has employee or admin role
    const isAuthorized = user && (user.email?.includes('admin') || user.email?.includes('employee'));
    
    console.log("Is authorized:", isAuthorized);
    
    if (!isAuthorized) {
      toast.error("Access denied", {
        description: "You don't have permission to access this page"
      });
      navigate('/');
    } else {
      console.log("Employee panel - User authorized:", user?.email);
    }
  }, [user, navigate]);
  
  const handleApproveItem = (id: string) => {
    // In a real app, this would call an API to approve the listing
    console.log(`Approved item ${id}`);
    toast.success("Listing approved", {
      description: "The listing has been approved and is now active"
    });
    
    // Update the UI to remove the approved item from the flagged list
    setFlaggedListings(prevListings => 
      prevListings.filter(listing => listing.id !== id)
    );
  };
  
  const handleRejectItem = (id: string) => {
    // In a real app, this would call an API to reject the listing
    console.log(`Rejected item ${id}`);
    toast.success("Listing rejected", {
      description: "The listing has been rejected and removed from the platform"
    });
    
    // Update the UI to remove the rejected item from the list
    setFlaggedListings(prevListings => 
      prevListings.filter(listing => listing.id !== id)
    );
  };
  
  const handleVerifyUsaListing = (id: string) => {
    // In a real app, this would call an API to verify the listing
    console.log(`Verified USA listing ${id}`);
    toast.success("USA listing verified", {
      description: "The listing location has been verified"
    });
    
    // Update the UI to mark the listing as verified
    setUsaListings(prevListings => 
      prevListings.map(listing => 
        listing.id === id 
          ? { ...listing, status: 'Verified' } 
          : listing
      )
    );
  };
  
  const handleDeleteListing = (id: string) => {
    const listing = flaggedListings.find(item => item.id === id);
    if (listing) {
      const updatedListing = {
        ...listing,
        decision: 'deleted',
        decisionBy: 'employee@example.com',
        decisionAt: new Date().toISOString()
      };
      
      setFlaggedHistory([updatedListing, ...flaggedHistory]);
      setFlaggedListings(flaggedListings.filter(listing => listing.id !== id));
      toast.success("Listing deleted successfully");
    }
  };

  const handleBlockListing = (id: string) => {
    const listing = flaggedListings.find(item => item.id === id);
    if (listing) {
      const updatedListing = {
        ...listing,
        decision: 'blocked',
        decisionBy: 'employee@example.com',
        decisionAt: new Date().toISOString()
      };
      
      setFlaggedHistory([updatedListing, ...flaggedHistory]);
      setFlaggedListings(flaggedListings.filter(listing => listing.id !== id));
      toast.success("Listing blocked and removed from the platform");
    }
  };
  
  const handleViewListing = (listingId: string) => {
    // Navigate to the listing detail page
    navigate(`/listing/${listingId}`);
  };

  const handleRejectUSAListing = (id: string) => {
    const listing = usaListings.find(item => item.id === id);
    if (listing) {
      const updatedListing = {
        ...listing,
        status: 'rejected',
        decision: 'rejected',
        decisionBy: 'employee@example.com',
        decisionAt: new Date().toISOString()
      };
      
      setUsaHistory([updatedListing, ...usaHistory]);
      setUsaListings(usaListings.filter(listing => listing.id !== id));
      toast.success("USA listing rejected. User will be notified.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employee Panel</h1>
          <p className="text-muted-foreground">Manage flagged and USA listings</p>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flagged">Flagged Listings</TabsTrigger>
          <TabsTrigger value="usa">USA Listings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flagged" className="mt-6">
          <FlaggedListingsSection 
            flaggedListings={flaggedListings}
            flaggedHistory={flaggedHistory}
            showFlaggedHistory={showFlaggedHistory}
            setShowFlaggedHistory={setShowFlaggedHistory}
            formatDate={formatDate}
            isMobile={isMobile}
            onDeleteListing={handleDeleteListing}
            onBlockListing={handleBlockListing}
            onApproveItem={handleApproveItem}
            onViewListing={handleViewListing}
          />
        </TabsContent>
        
        <TabsContent value="usa" className="mt-6">
          <UsaListingsSection 
            usaListings={usaListings}
            usaHistory={usaHistory}
            showUsaHistory={showUsaHistory}
            setShowUsaHistory={setShowUsaHistory}
            formatDate={formatDate}
            isMobile={isMobile}
            onVerifyUsaListing={handleVerifyUsaListing}
            onRejectUsaListing={handleRejectUSAListing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeePanel;
