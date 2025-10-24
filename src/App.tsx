import {
  Routes,
  Route,
  Navigate,
  useLocation,
  ScrollRestoration,
  useNavigationType,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
// import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import PageLayout from "@/components/PageLayout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CreateListing from "@/pages/CreateListing";
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
import { SocketProvider } from "@/context/SocketContext";
import { MessageProvider } from "./context/MessageContext";
import PostListingForm from "./components/PostListingForm";
import Marketplace from "./pages/Marketplace";
import MarketplaceService from "./pages/MarketplaceService";
import MarketplaceItems from "./pages/MarketplaceItems";
import Rides from "./pages/Rides";
import { LocationProvider } from "./context/LocationContext";
import Accommodations from "./pages/Accommodations";
import Jobs from "./pages/Jobs";
import Home from "./pages/Home";
import MainLayout from "./components/layouts/MainLayout";
import { useEffect, useState, useLayoutEffect } from "react";
import RouteChangeListener from "./hooks/RouteChangeListener";

import Chatbox from "./pages/TestMessage/Chatbox";
import useDataLoad from "./hooks/useDataLoad";
import RidesAvailable from "./pages/RidesAvailable";
import RidesLooking from "./pages/RidesLooking";
import AccommodationsAvailable from "./pages/AccommodationsAvailable";
import AccommodationsLooking from "./pages/AccommodationsLooking";
import JobsHiring from "./pages/JobsHiring";
import JobsLooking from "./pages/JobsLooking";
import ListingDetailPage from "./pages/ListingDetailPage";
import HelloPost from "./pages/HelloPost";
import ScrollToTop from "./hooks/useScrollTop";
import { Helmet } from "react-helmet-async";

// Redirect component that checks authentication
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // If still loading auth state, don't redirect yet
  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(0,0,0, .2)",
            borderTop: "4px solid #ff6b00",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        />
        <p
          style={{
            color: "#ff6b00",
            fontSize: "18px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          Loading...
        </p>
      </div>
    );
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
  const editId = searchParams.get("id");
  const isEditing = Boolean(editId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>
          Desieasy | Post. Find. Connect. | Free Local Listings in USA
        </title>
        <meta
          name="description"
          content="Post and find accommodations, jobs, rides, and marketplace listings with Desieasy. A platform built to connect people through listings that are simple, local, and free."
        />
        <link rel="canonical" href="https://desieasy.com/" />
        <meta
          property="og:title"
          content="Desieasy | Post. Find. Connect. | Free Local Listings in USA"
        />
        <meta
          property="og:description"
          content="Post and find accommodations, jobs, rides, and marketplace listings with Desieasy. A platform built to connect people through listings that are simple, local, and free."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://desieasy.com/" />
      </Helmet>


      <ScrollToTop>
        <Routes>
          <Route path="/auth" element={<Navigate to="/" replace />} />

          {/* Main Menu Pages (with dual sidebars on desktop) */}
          <Route
            path="/"
            element={
              <ResponsiveLayout>
                <Home openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/accommodations"
            element={
              <ResponsiveLayout>
                <Accommodations openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/accommodations/available"
            element={
              <ResponsiveLayout>
                <AccommodationsAvailable openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/accommodations/looking"
            element={
              <ResponsiveLayout>
                <AccommodationsLooking openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/jobs"
            element={
              <ResponsiveLayout>
                <Jobs openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/jobs/hiring"
            element={
              <ResponsiveLayout>
                <JobsHiring openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/jobs/looking"
            element={
              <ResponsiveLayout>
                <JobsLooking openModal={openModal} />
              </ResponsiveLayout>
            }
          />

          <Route
            path="/marketplace"
            element={
              // <ResponsiveLayout>
              //   <Index />
              // </ResponsiveLayout>
              <ResponsiveLayout>
                <Marketplace openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/marketplace/services"
            element={
              <ResponsiveLayout>
                <MarketplaceService openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/marketplace/items"
            element={
              <ResponsiveLayout>
                <MarketplaceItems openModal={openModal} />
              </ResponsiveLayout>
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
              <ResponsiveLayout>
                <Rides openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/rides/available"
            element={
              <ResponsiveLayout>
                <RidesAvailable openModal={openModal} />
              </ResponsiveLayout>
            }
          />

          <Route
            path="/rides/looking"
            element={
              <ResponsiveLayout>
                <RidesLooking openModal={openModal} />
              </ResponsiveLayout>
            }
          />

          {/* Pages with back button and consistent layout - Protected routes */}
          <Route
            path="/create-listing"
            element={
              <ResponsiveLayout
                title={isEditing ? "Edit Listing" : "Create Listing"}
              >
                <PostListingForm />
              </ResponsiveLayout>
            }
          />

          <Route
            path="/listing/:id"
            element={
              <ResponsiveLayout title="Listing Details">
                <ListingDetailPage openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/marketplace/:id"
            element={
              <ResponsiveLayout title="Listing Details">
                <ListingDetailPage openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/rides/:id"
            element={
              <ResponsiveLayout title="Listing Details">
                <ListingDetailPage openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/accommodations/:id"
            element={
              <ResponsiveLayout title="Listing Details">
                <ListingDetailPage openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ResponsiveLayout title="Listing Details">
                <ListingDetailPage openModal={openModal} />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Messages">
                  <Messages />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/messages/:conversationId"
            element={
              <PrivateRoute>
                <ResponsiveLayout>
                  <ChatPage />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/messages2"
            element={
              <ResponsiveLayout>
                <Chatbox />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Profile">
                  <Profile />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-listings"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Saved Listings">
                  <SavedListings />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Manage Listings">
                  <ManageListings />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Admin Panel">
                  <Admin />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <PrivateRoute>
                <ResponsiveLayout title="Employee Panel">
                  <EmployeePanel />
                </ResponsiveLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/discover-desieasy"
            element={
              <ResponsiveLayout title="Discover Desieasy">
                <AboutUs />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <ResponsiveLayout title="Privacy Policy">
                <PrivacyPolicy />
              </ResponsiveLayout>
            }
          />
          <Route
            path="/user-agreement"
            element={
              <ResponsiveLayout title="User Agreement">
                <UserAgreement />
              </ResponsiveLayout>
            }
          />
          <Route
            path="*"
            element={
              <ResponsiveLayout>
                <NotFound />
              </ResponsiveLayout>
            }
          />
        </Routes>
      </ScrollToTop>

      {/*  <ScrollRestoration
        getKey={(location, matches) => {
          return location.pathname;
        }}
      /> */}
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useDataLoad();

  // Add this to your App.jsx or main component
  useEffect(() => {
    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].pageY;
        isDragging = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const currentY = e.touches[0].pageY;
      const deltaY = currentY - startY;

      if (deltaY > 150 && window.scrollY === 0) {
        setIsRefreshing(true);
      }

      if (deltaY > 200 && window.scrollY === 0) {
        setShowLoading(true);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    };

    const handleTouchEnd = () => {
      if (!showLoading) {
        setIsRefreshing(false);
      }
      isDragging = false;
    };

    document.addEventListener("loadeddata", (e) => {
      console.log(document.getElementById("root"));
    });

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [showLoading]);

  return (
    <>
      {showLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(0,0,0, .2)",
              borderTop: "4px solid #ff6b00",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "20px",
            }}
          />
          <p
            style={{
              color: "#ff6b00",
              fontSize: "18px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Refreshing...
          </p>
        </div>
      )}

      <AuthProvider>
        <ListingProvider>
          <LocationProvider>
            <SocketProvider>
              <MessageProvider>
                <RouteChangeListener />
                <AppRoutes />
              </MessageProvider>
            </SocketProvider>
          </LocationProvider>
        </ListingProvider>
      </AuthProvider>
    </>
  );
}

export default App;
