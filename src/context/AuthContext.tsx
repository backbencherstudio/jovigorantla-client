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

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/axois"; // your axios instance with `withCredentials: true`
import { useLocation, useNavigate } from "react-router-dom";
import CustomModal from "@/components/shared/CustomModal";
import progress from "@/assets/progress.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  signUp: (
    email: string,
    password: string,
    name: string,
    otp: string
  ) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  updateMe: (name?: string) => Promise<boolean>;
  signUpWithGoogle: () => Promise<boolean>;
  addFavoritesListing: (listingId: string) => Promise<boolean>;
  deleteFavoritesListing: (listingId: string) => Promise<boolean>;
  sendOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  setFormData: (formData: any) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (
    email: string,
    password: string,
    token: string
  ) => Promise<boolean>;
  isOpenSuccessAfterLogin: boolean;
  isOpenPendingAfterLogin: boolean;
  isOpenErrorAfterLogin: boolean;
  isUploading: boolean;
  isModalOpen: boolean;

  setIsOpenErrorAfterLogin: (boolean) => void;
  setIsOpenSuccessAfterLogin: (boolean) => void;
  setIsOpenPendingAfterLogin: (boolean) => void;
  fetchFavoritesListings: () => Promise<boolean>;
  setIsModalOpen: (boolean) => void;
};

interface FileRecord {
  id: number;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  file: File;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritesListings, setFavoritesListings] = useState([]);
  const [formData, setFormData] = useState(null);
  const [isOpenSuccessAfterLogin, setIsOpenSuccessAfterLogin] = useState(false);
  const [isOpenPendingAfterLogin, setIsOpenPendingAfterLogin] = useState(false);
  const [isOpenErrorAfterLogin, setIsOpenErrorAfterLogin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  let dbInstance: IDBDatabase | null = null;

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (dbInstance) {
        return resolve(dbInstance);
      }

      const request = indexedDB.open("MyFileStorage", 1);

      request.onupgradeneeded = (event) => {
        const target = event.target as IDBOpenDBRequest;
        dbInstance = target.result;
        if (!dbInstance.objectStoreNames.contains("files")) {
          dbInstance.createObjectStore("files", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  };

  const wipeDatabaseCompletely = async (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Close existing connection if open
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }

      const request = indexedDB.deleteDatabase("MyFileStorage");

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);

      request.onblocked = () => {
        // If blocked, wait and try again
        setTimeout(() => {
          indexedDB.deleteDatabase("MyFileStorage").onsuccess = () => resolve();
        }, 200);
      };
    });
  };

  const getFirstFile = async (): Promise<File | null> => {
    try {
      const db = await openDB();

      return new Promise<File | null>((resolve) => {
        const transaction = db.transaction("files", "readonly");
        const store = transaction.objectStore("files");

        const request = store.openCursor();

        request.onsuccess = (event: Event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
            .result;
          resolve(cursor ? (cursor.value as FileRecord).file : null);
        };

        request.onerror = () => {
          resolve(null); // Resolve with null on error too
        };
      });
    } catch {
      return null; // Return null if database opening fails
    }
  };

  // useEffect(() => {
  //   const saveListing = async () => {
  //     const redirect = localStorage.getItem("redirect");
  //     if (redirect) {
  //       localStorage.removeItem("redirect");

  //       let afterLoginForm = localStorage.getItem("afterLogin");

  //       if (afterLoginForm) {
  //         afterLoginForm = JSON.parse(localStorage.getItem("afterLogin"))

  //         const formData = new FormData()
  //         for (const key in afterLoginForm as any) {
  //           formData.append(key, afterLoginForm[key])
  //         }
  //         // if (localStorage.getItem("image")) {
  //         //   console.log("image", localStorage.getItem("image"))
  //         //   formData.append("image", localStorage.getItem("image"))
  //         // }
  //         const image = await getFirstFile();
  //         if (image) {
  //           formData.append("image", image)
  //         }

  //         api.post('/listings', formData, {
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //           }
  //         }).then((res) => {
  //           localStorage.removeItem("afterLogin")
  //           if (res.data.success) {
  //             if ((afterLoginForm as any).post_to_usa == "true") {
  //               setIsOpenPendingAfterLogin(true)
  //             } else {
  //               setIsOpenSuccessAfterLogin(true)
  //             }
  //             wipeDatabaseCompletely().then(() => {
  //               // console.log('Database wiped successfully');
  //             }).catch((error) => {
  //               console.error('Error wiping database:', error);
  //             });
  //           } else {
  //             setIsOpenErrorAfterLogin(true)
  //           }
  //         }).catch((err) => {
  //           console.log(err);
  //           setIsOpenErrorAfterLogin(true)
  //         })
  //       }
  //       navigate(redirect);
  //     }
  //   }
  //   saveListing()
  // }, []);

  useEffect(() => {
    const saveListing = async () => {
      const redirect = localStorage.getItem("redirect");
      if (!redirect) return;
      navigate(redirect);
      try {
        localStorage.removeItem("redirect");
        const afterLoginForm = localStorage.getItem("afterLogin");

        if (!afterLoginForm) {
          navigate(redirect);
          return;
        }

        const formData = new FormData();
        const parsedForm = JSON.parse(afterLoginForm);

        for (const key in parsedForm) {
          formData.append(key, parsedForm[key]);
        }

        try {
          const image = await getFirstFile();
          if (image) {
            formData.append("image", image);
            setIsUploading(true);
          }
        } catch (error) {
          console.log("No image found or error getting image:", error);
          // Continue without image if there's an error
        }

        const response = await api.post("/listings", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        localStorage.removeItem("afterLogin");

        if (response.data.success) {
          setIsUploading(false);
          if (parsedForm.post_to_usa === "true") {
            setIsOpenPendingAfterLogin(true);
          } else {
            setIsOpenSuccessAfterLogin(true);
          }

          await wipeDatabaseCompletely();
        } else {
          setIsOpenErrorAfterLogin(true);
        }
      } catch (error) {
        console.error("Error saving listing:", error);
        setIsOpenErrorAfterLogin(true);
      } finally {
        navigate(redirect);
      }
    };

    saveListing();
  }, [navigate]);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me", {
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
    fetchFavoritesListings();
    console.log(localStorage.getItem("image"));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
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
      localStorage.setItem("redirect", location.pathname);
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
      return true;

      // const res = await api.get('/auth/google');
      // console.log(res);
      // if (res.data.success) {
      //   await fetchUser();
      //   return true;
      // }
      return false;
    } catch {
      return false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    otp: string
  ) => {
    try {
      // const otp = localStorage.getItem("otp");
      const res = await api.post("/auth/register", {
        email,
        password,
        name,
        otp,
      });

      console.log("from sign up=> ", res.data);

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
      const res = await api.post("/auth/logout");
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
      const res = await api.patch("/auth/update", { name });
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
      const res = await api.get("/favorites");
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
      const res = await api.post("/favorites", {
        listing_id: listingId,
      });

      console.log("from => ", res.data);
      if (res.data.success) {
        // go throw favoritesListings and remove the listing with the id of listingId
        // setFavoritesListings(
        //   favoritesListings.filter((listing: any) => listing.id !== listingId)
        // );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const addFavoritesListing = async (listingId: string) => {
    try {
      const res = await api.post("/favorites", {
        listing_id: listingId,
      });
      if (res.data.success) {
        fetchFavoritesListings();
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
      const res = await api.post("/auth/send-otp", { email });
      // console.log(res)
      return res.data.success;
    } catch {
      return false;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      return res.data.success;
    } catch {
      return false;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data.success;
    } catch {
      return false;
    }
  };

  const resetPassword = async (
    email: string,
    password: string,
    token: string
  ) => {
    try {
      const res = await api.post("/auth/reset-password", {
        email,
        password,
        token,
      });
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
    sendOtp,
    verifyOtp,
    setFormData,
    forgotPassword,
    resetPassword,
    isUploading,
    isModalOpen,
    isOpenSuccessAfterLogin,
    isOpenPendingAfterLogin,
    isOpenErrorAfterLogin,
    setIsOpenErrorAfterLogin,
    setIsOpenSuccessAfterLogin,
    setIsOpenPendingAfterLogin,
    fetchFavoritesListings,
    setIsModalOpen,
    setFavoritesListings,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* {isUploading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
  
            <div className="inline-flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b00]"></div>
            </div>

  
            <h3 className="text-lg font-medium text-gray-900 mb-2">Creating Listing</h3>
            <p className="text-gray-600">Please wait while we process your listing...</p>

       
            <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-brand h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    )} */}

      {isUploading && (
        <Dialog open={isUploading} onOpenChange={(open) => {}}>
          <div>
            <DialogContent className="rounded-lg max-w-md w-full p-6 bg-white shadow-lg">
              <div className="absolute h-8 w-8 flex justify-center items-center right-4 top-4 rounded-full hover:bg-gray-100 p-2">
                ✕
              </div>

              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b00]"></div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Creating Listing
                </h3>
                <p className="text-gray-600">
                  Please wait while we process your listing...
                </p>

                <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-brand h-2.5 rounded-full animate-pulse"
                    style={{ width: "70%" }}
                  ></div>
                </div>

                <Button
                  className="w-full bg-[#ff6b00] text-white rounded-full py-6 mt-6 focus:border-none focus:outline-none focus:ring-0"
                  onClick={() => {}}
                  autoFocus={false}
                  // tabIndex={-1}
                >
                  Please Wait
                </Button>
              </div>
            </DialogContent>
          </div>
        </Dialog>
      )}

      {/* <CustomModal
        open={isUploading}
        onOpenChange={(_)=> {}}
        title="Your listing is under review and will be live if approved."
        icon={<img className="" src={progress} alt="loading" />}
      /> */}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
