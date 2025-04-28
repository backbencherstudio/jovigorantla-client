import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ListingForm from "@/components/ListingForm";
import { useAuthModal } from "@/hooks/useAuthModal";
import AuthModal from "@/components/AuthModal";

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

  // useEffect(() => {
  //   // Check if user is authenticated
  //   if (!user) {
  //     toast.error('Please sign in to create a listing', {
  //       description: 'You need to login to post a listing'
  //     });
  //     navigate('/auth');
  //   }
  // }, [user, navigate]);

  const handleSubmit = async (formData: ListingFormData) => {
    setIsSubmitting(true);
    sessionStorage.setItem("postData", JSON.stringify(formData));
    if (!user) {
      openModal("login");
    }
    try {
      console.log("Submitting listing data:", formData);
      setTimeout(() => {
        toast.success("Listing created successfully", {
          description: "Your listing has been posted successfully",
        });
      }, 1500);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing", {
        description:
          "There was an error creating your listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-6">
      <ListingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <AuthModal
        open={isOpen}
        onOpenChange={closeModal}
        defaultTab={defaultTab}
      />
    </div>
  );
};

export default CreateListing;
