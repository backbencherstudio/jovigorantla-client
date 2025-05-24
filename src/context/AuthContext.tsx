
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { Session, User, Provider } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client';

// type AuthContextType = {
//   session: Session | null;
//   user: User | null;
//   signIn: (email: string, password: string) => Promise<{
//     error: Error | null;
//     data: Session | null;
//   }>;
//   signUp: (email: string, password: string, username: string) => Promise<{
//     error: Error | null;
//     data: Session | null;
//   }>;
//   signInWithProvider: (provider: Provider) => Promise<{
//     error: Error | null;
//     data: Session | null;
//   }>;
//   resetPassword: (email: string) => Promise<{
//     error: Error | null;
//     data: Session | null;
//   }>;
//   signOut: () => Promise<void>;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     // Set up auth state listener FIRST
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         console.log("Auth state changed:", event, session?.user?.email);
//         setSession(session);
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     // THEN check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       console.log("Got existing session:", session?.user?.email);
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     setLoading(true);
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     setLoading(false);
//     return { data: data.session, error };
//   };

//   const signUp = async (email: string, password: string, username: string) => {
//     setLoading(true);
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           username,
//         },
//       },
//     });
//     setLoading(false);
//     return { data: data.session, error };
//   };

//   const signInWithProvider = async (provider: Provider) => {
//     setLoading(true);
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider,
//       options: {
//         redirectTo: window.location.origin,
//       }
//     });
//     // Note: For OAuth login, the setLoading(false) will happen when the user returns from the OAuth provider
//     // and the onAuthStateChange event fires.
//     // We don't set loading to false here because the user is redirected away
//     return { data: null, error };
//   };

//   const resetPassword = async (email: string) => {
//     setLoading(true);
//     const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/auth?reset=true`,
//     });
//     setLoading(false);
//     return { data: null, error };
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     // Instead of using navigate directly, we'll let components handle navigation after signout
//     window.location.href = '/auth'; // This is a safer alternative that doesn't require Router context
//   };

//   const value = {
//     session,
//     user,
//     signIn,
//     signUp,
//     signInWithProvider,
//     resetPassword,
//     signOut,
//     loading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     console.error('AuthContext is undefined. Make sure you are using useAuth within an AuthProvider component hierarchy.');
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/axois'; // your axios instance with `withCredentials: true`


type User = {
  id: string;
  email: string;
  name?: string;
  type: string;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  favoritesListings: any[];
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name?: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateMe: (name?: string) => Promise<boolean>;
  signUpWithGoogle: () => Promise<boolean>;
  addFavoritesListing: (listingId: string) => Promise<boolean>;
  deleteFavoritesListing: (listingId: string) => Promise<boolean>;
  sendOtp: (email: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritesListings, setFavoritesListings] = useState([]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me', {
        withCredentials: true,
      });
      // console.log(res);
      
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchFavoritesListings()
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        await fetchUser();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const res = await api.get('/auth/google');
      console.log(res);
      if (res.data.success) {
        await fetchUser();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };


  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const res = await api.post('/auth/signup', {
        email,
        password,
        name,
      });

      if (res.data.success) {
        await fetchUser();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const signOut = async () => {
    try {
      const res = await api.post('/auth/logout');
      if (res.data.success) {
        setUser(null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateMe = async (name?: string) => {
    try {
      const res = await api.patch('/auth/update', { name });
      console.log(res);
      if (res.data.success) {
        await fetchUser();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const fetchFavoritesListings = async () => {
    try {
      // if (!user) {
      //   setFavoritesListings([]);
      //   return;
      // }
      const res = await api.get('/favorites');
      if (res.data.success) {
        setFavoritesListings(res.data.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteFavoritesListing = async (listingId: string) => {
    try {
      const res = await api.post('/favorites', { 
        listing_id: listingId,
       });
      if (res.data.success) {
        // go throw favoritesListings and remove the listing with the id of listingId
        setFavoritesListings(favoritesListings.filter((listing: any) => listing.id !== listingId));
        return true
      }
      return false;
    } catch {
      return false;
    }
  };

  const addFavoritesListing = async (listingId: string) => {
    try {
      const res = await api.post('/favorites', { 
        listing_id: listingId,
       });
      if (res.data.success) {
        fetchFavoritesListings()
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // console.log(favoritesListings)



  const sendOtp = async (email: string) => {
    try {
      const res = await api.post('/auth/send-otp', { email });
      return res.data.success;
    } catch {
      return false;
    }
  };

  const value = {
    user,
    loading,
    favoritesListings,
    signIn,
    signUp,
    signOut,
    updateMe,
    signUpWithGoogle,
    addFavoritesListing,
    deleteFavoritesListing,
    sendOtp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
