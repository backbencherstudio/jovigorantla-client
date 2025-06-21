import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
// import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import PageLayout from "@/components/PageLayout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CreateListing from "@/pages/CreateListing";
import ListingDetailPage from "@/pages/ListingDetailPage";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import SavedListings from "@/pages/SavedListings";
import ManageListings from "@/pages/ManageListings";
import Admin from "@/pages/Admin";
import EmployeePanel from "@/pages/EmployeePanel";
import Messages from "@/pages/Messages";
import AboutUs from "@/pages/AboutUs";
import AuthModal from "@/components/AuthModal";
import { useAuthModal } from "@/hooks/useAuthModal";
import "./App.css";
import ChatPage from "./pages/ChatPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import UserAgreement from "./pages/UserAgreement";
import { ListingProvider } from "./context/ListingContext";
import { SocketProvider } from '@/context/SocketContext';
import { MessageProvider } from "./context/MessageContext";
import PostListingForm from "./components/PostListingForm";
import Marketplace from "./pages/Marketplace";
import Rides from "./pages/Rides";
import { LocationProvider } from "./context/LocationContext";
import Accommodations from "./pages/Accommodations";

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
  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/auth" element={<Navigate to="/" replace />} />

        {/* Main Menu Pages (with dual sidebars on desktop) */}
        <Route
          path="/"
          element={
            <ResponsiveLayout>
              <Index />
            </ResponsiveLayout>
          }
        />
        <Route
          path="/accommodations"
          element={
            // <ResponsiveLayout>
            //   <Index />
            // </ResponsiveLayout>
            <Accommodations />
          }
        />
        <Route
          path="/jobs"
          element={
            <ResponsiveLayout>
              <Index />
            </ResponsiveLayout>
          }
        />
        <Route
          path="/marketplace"
          element={
            // <ResponsiveLayout>
            //   <Index />
            // </ResponsiveLayout>
            <Marketplace />
          }
        />
        {/* <Route
          path="/services"
          element={
            <Marketplace />
          }
        /> */}
        <Route
          path="/rides"
          element={
            // <ResponsiveLayout>
            //   <Index />
            // </ResponsiveLayout>
            <Rides />
          }
        />

        {/* Pages with back button and consistent layout - Protected routes */}
        <Route
          path="/create-listing"
          element={
            <PageLayout title={isEditing ? "Editing Listing" : "Create Listing"}>
              {/* <CreateListing isEditing={isEditing} /> */}
              <PostListingForm />
            </PageLayout>
          }
        />

        {/* <Route
          path='listing/create'
          element={
            <PageLayout title="Post Create Listing">
              
            </PageLayout>
          } /> */}

        <Route
          path="/listing/:id"
          element={
            <PageLayout title="Listing Details">
              <ListingDetailPage />
            </PageLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <PageLayout title="Messages">
                <Messages />
              </PageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/messages/:conversationId"
          element={
            <PrivateRoute>
              <PageLayout title="Chat">
                <ChatPage />
              </PageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <PageLayout title="Profile">
                <Profile />
              </PageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/saved-listings"
          element={
            <PrivateRoute>
              <PageLayout title="Saved Listings">
                <SavedListings />
              </PageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <PrivateRoute>
              <PageLayout title="My Listings">
                <ManageListings />
              </PageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <PageLayout title="Admin Panel">
                <Admin />
              </PageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute>
              <PageLayout title="Employee Panel">
                <EmployeePanel />
              </PageLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/about-us"
          element={
            <PageLayout title="About Us">
              <AboutUs />
            </PageLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageLayout title="Privacy Policy">
              <PrivacyPolicy />
            </PageLayout>
          }
        />
        <Route
          path="/user-agreement"
          element={
            <PageLayout title="User Agreement">
              <UserAgreement />
            </PageLayout>
          }
        />
        <Route
          path="*"
          element={
            <PageLayout>
              <NotFound />
            </PageLayout>
          }
        />
      </Routes>
      <Toaster position="top-center" richColors />
      <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab as "login" | "signup"}
      />
    </div>
  );
}

// Main App component - wrap AppRoutes with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <ListingProvider>
          <LocationProvider>
            <SocketProvider>
              <MessageProvider>
                <AppRoutes />
              </MessageProvider>
            </SocketProvider>
          </LocationProvider>
        </ListingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
