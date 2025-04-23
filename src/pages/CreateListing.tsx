
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import ListingForm from '@/components/ListingForm';

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to create a listing', {
        description: 'You need to login to post a listing'
      });
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting listing data:', formData);
      
      // Here would normally submit to Supabase
      // For now, just simulate with toast
      
      setTimeout(() => {
        toast.success('Listing created successfully', {
          description: 'Your listing has been posted successfully'
        });
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing', {
        description: 'There was an error creating your listing. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-6">
      <ListingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreateListing;
