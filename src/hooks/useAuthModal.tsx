
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const openModal = useCallback((tab: 'login' | 'signup' = 'login') => {
    setDefaultTab(tab);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Function to redirect to the auth page instead of opening modal if needed
  const redirectToAuth = useCallback((tab: 'login' | 'signup' = 'login') => {
    navigate(`/auth?tab=${tab}`);
  }, [navigate]);

  return {
    isOpen,
    defaultTab,
    openModal,
    closeModal,
    redirectToAuth
  };
}
