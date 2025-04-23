
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import PageLayout from '@/components/PageLayout';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import CreateListing from '@/pages/CreateListing';
import ListingDetailPage from '@/pages/ListingDetailPage';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import SavedListings from '@/pages/SavedListings';
import ManageListings from '@/pages/ManageListings';
import Admin from '@/pages/Admin';
import EmployeePanel from '@/pages/EmployeePanel';
import Messages from '@/pages/Messages';
import AboutUs from '@/pages/AboutUs';
import AuthModal from '@/components/AuthModal';
import { useAuthModal } from '@/hooks/useAuthModal';
import './App.css';

// Redirect component that checks authentication
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, don't redirect yet
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Move AppRoutes outside of App and make it a separate component
function AppRoutes() {
  const { isOpen, defaultTab, openModal, closeModal } = useAuthModal();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/auth" element={<Navigate to="/" replace />} />
        
        {/* Main Menu Pages (with dual sidebars on desktop) */}
        <Route path="/" element={<ResponsiveLayout><Index /></ResponsiveLayout>} />
        <Route path="/accommodations" element={<ResponsiveLayout><Index /></ResponsiveLayout>} />
        <Route path="/jobs" element={<ResponsiveLayout><Index /></ResponsiveLayout>} />
        <Route path="/marketplace" element={<ResponsiveLayout><Index /></ResponsiveLayout>} />
        <Route path="/rides" element={<ResponsiveLayout><Index /></ResponsiveLayout>} />
        
        {/* Pages with back button and consistent layout - Protected routes */}
        <Route path="/create-listing" element={<PrivateRoute><PageLayout title="Create Listing"><CreateListing /></PageLayout></PrivateRoute>} />
        <Route path="/listing/:id" element={<PageLayout title="Listing Details"><ListingDetailPage /></PageLayout>} />
        <Route path="/messages" element={<PrivateRoute><PageLayout title="Messages"><Messages /></PageLayout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><PageLayout title="Profile"><Profile /></PageLayout></PrivateRoute>} />
        <Route path="/saved-listings" element={<PrivateRoute><PageLayout title="Saved Listings"><SavedListings /></PageLayout></PrivateRoute>} />
        <Route path="/my-listings" element={<PrivateRoute><PageLayout title="My Listings"><ManageListings /></PageLayout></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><PageLayout title="Admin Panel"><Admin /></PageLayout></PrivateRoute>} />
        <Route path="/employee" element={<PrivateRoute><PageLayout title="Employee Panel"><EmployeePanel /></PageLayout></PrivateRoute>} />
        <Route path="/about-us" element={<PageLayout title="About Us"><AboutUs /></PageLayout>} />
        <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
      </Routes>
      <Toaster position="top-center" />
      <AuthModal open={isOpen} onOpenChange={closeModal} defaultTab={defaultTab} />
    </div>
  );
}

// Main App component - wrap AppRoutes with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
