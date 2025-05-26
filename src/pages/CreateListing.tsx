import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ListingForm from "@/components/ListingForm";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "@/components/AuthModal";
import { api } from "@/lib/axois";

interface ListingFormData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  subCategory?: string;
  address?: string;
  postToUSA?: boolean;
  images: File[];
  radius: number;
}

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, defaultTab, openModal, closeModal } = useAuthModal();
  const [pendingFormData, setPendingFormData] = useState<ListingFormData | null>(null);

  // Effect to handle post-login listing creation
  useEffect(() => {
    const createListingAfterLogin = async () => {
      if (user && pendingFormData) {
        setIsSubmitting(true);
        try {
          // Create form data for API call
          const apiFormData = new FormData();
          apiFormData.append("title", pendingFormData.title || "");
          apiFormData.append("description", pendingFormData.description || "");
          if (pendingFormData.price) {
            apiFormData.append("price", pendingFormData.price.toString());
          }
          apiFormData.append("category", pendingFormData.category || "");
          apiFormData.append("sub_category", pendingFormData.subCategory || "");
          apiFormData.append("address", pendingFormData.address || "");
          apiFormData.append("post_to_usa", (pendingFormData.postToUSA || false).toString());
          apiFormData.append("radius", pendingFormData.radius.toString());
          
          if (pendingFormData.images.length > 0) {
            apiFormData.append("image", pendingFormData.images[0]);
          }

          const response = await api.post("/listings", apiFormData);
          
          if (response.data.success) {
            toast.success("Listing created successfully");
            navigate("/");
          } else {
            toast.error("Failed to create listing");
          }
        } catch (error) {
          console.error("Error creating listing:", error);
          toast.error("Failed to create listing", {
            description: "There was an error creating your listing. Please try again.",
          });
        } finally {
          setIsSubmitting(false);
          setPendingFormData(null);
        }
      }
    };

    createListingAfterLogin();
  }, [user, pendingFormData, navigate]);

  const handleSubmit = async (formData: ListingFormData) => {
    if (!user) {
      // Store form data and show login modal
      setPendingFormData(formData);
      console.log("Form data stored for later submission", formData);
      
      openModal("login");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create form data for API call
      const apiFormData = new FormData();
      apiFormData.append("title", formData.title || "");
      apiFormData.append("description", formData.description || "");
      if (formData.price) {
        apiFormData.append("price", formData.price.toString());
      }
      apiFormData.append("category", formData.category || "");
      apiFormData.append("sub_category", formData.subCategory || "");
      apiFormData.append("address", formData.address || "");
      apiFormData.append("post_to_usa", (formData.postToUSA || false).toString());
      apiFormData.append("radius", formData.radius.toString());
      
      if (formData.images.length > 0) {
        apiFormData.append("image", formData.images[0]);
      }

      const response = await api.post("/listings", apiFormData);
      
      if (response.data.success) {
        toast.success("Listing created successfully");
        navigate("/");
      } else {
        toast.error("Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing", {
        description: "There was an error creating your listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-6">
      <ListingForm
        user={user}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab as "login" | "signup"}
      />
    </div>
  );
};

export default CreateListing;
