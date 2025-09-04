// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Mail, User } from "lucide-react";

// const Profile = () => {
//   const { user, updateMe } = useAuth();
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [width, setWidth] = useState("768px");
//   useEffect(() => {
//     // Function to update width based on screen size
//     const updateWidth = () => {
//       const screenWidth = window.innerWidth;
//       if (screenWidth >= 1024 && screenWidth < 1300) {
//         setWidth(`${screenWidth - 540}px`);
//       } else if (screenWidth < 1024 && screenWidth > 778) {
//         setWidth(`${770}px`);
//       } else if (screenWidth < 778) {
//         setWidth("100%");
//       } else {
//         setWidth("768px");
//       }
//     };
//     // Set initial width
//     updateWidth();
//     // Add event listener for window resize
//     window.addEventListener("resize", updateWidth);
//     // Clean up event listener
//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   useEffect(() => {
//     if (!user) {
//       navigate("/auth");
//       return;
//     }

//     // Load user data
//     setEmail(user.email || "");

//     // Get name from localStorage or use the first part of email as a fallback
//     // const storedName = localStorage.getItem(`userName_${user.id}`);
//     setName( user.name || "");
//   }, [user, navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//         const isUpdated = await updateMe(name);
//         if (isUpdated) {
//           toast.success("Profile updated successfully", {
//             className: "bg-green-500 text-white font-bold rounded-md px-4 py-2 shadow-md",
//           });
//         }else{
//           toast.error("Failed to update profile",{
//               className: "bg-red-500 text-white font-bold rounded-md px-4 py-2 shadow-md"
//              },
//           );
//         }

//     } catch (error) {
//       toast.error("Failed to update profile");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="bg-gray-50">
//       <div className="p-3 space-y-6 bg-white">
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="space-y-2">
//             <Label htmlFor="name">Name</Label>
//             <div className="relative">
//               <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//               <Input
//                 id="name"
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="pl-10"
//                 placeholder="Your name"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 className="pl-10 bg-gray-100"
//                 readOnly
//                 disabled
//               />
//             </div>
//             <p className="text-sm text-gray-500">Email cannot be changed</p>
//           </div>

//           <div style={{ width: width }} className="fixed bottom-3  pr-6">
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, User, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AboutFooter from "./AboutFooter";

const Profile = () => {
  const { user, updateMe } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState("768px");
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024 && screenWidth < 1300) {
        setWidth(`${screenWidth - 540}px`);
      } else if (screenWidth < 1024 && screenWidth > 778) {
        setWidth(`${770}px`);
      } else if (screenWidth < 778) {
        setWidth("100%");
      } else {
        setWidth("768px");
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setEmail(user.email || "");
    setName(user.name || "");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isUpdated = await updateMe(name);
      if (isUpdated) {
        toast.success("Profile updated successfully", {
          className:
            "bg-green-500 text-white font-bold rounded-md px-4 py-2 shadow-md",
        });
      } else {
        toast.error("Failed to update profile", {
          className:
            "bg-red-500 text-white font-bold rounded-md px-4 py-2 shadow-md",
        });
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openNameDialog = () => {
    setTempName(name);
    setIsNameDialogOpen(true);
  };

  const closeNameDialog = () => {
    setIsNameDialogOpen(false);
  };

  const saveName = async (e) => {
    e.preventDefault();

    if (tempName.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const isUpdated = await updateMe(tempName);
      if (isUpdated) {
        setName(tempName);
        toast.success("Name updated successfully", {
          className:
            "bg-green-500 text-white font-bold rounded-md px-4 py-2 shadow-md",
        });
        closeNameDialog();
      } else {
        toast.error("Failed to update name", {
          className:
            "bg-red-500 text-white font-bold rounded-md px-4 py-2 shadow-md",
        });
      }
    } catch (error) {
      toast.error("Failed to update name");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = () => {
    // Scroll the dialog content into view when input is focused
    setTimeout(() => {
      const input = document.querySelector("input:focus");
      if (input) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300); // Delay to account for keyboard animation
  };

  if (!user) return null;

  return (
    <div className="bg-white min-h-[calc(100vh-120px)] p-2 py-4 pb-0 lg:pb-0 flex flex-col justify-between">
      <div className="px-4 space-y-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 pt-1">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="name"
                type="text"
                value={name.slice(0, 15)}
                readOnly
                className="pl-10 pr-10 cursor-pointer"
                onClick={openNameDialog}
              />
              <ChevronRight
                className="absolute right-3 top-3 h-4 w-4 text-gray-500 cursor-pointer"
                onClick={openNameDialog}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                value={email}
                className="pl-10 bg-gray-100"
                readOnly
                disabled
              />
            </div>
            <p className="text-sm text-gray-500">Email cannot be changed</p>
          </div>
        </form>

        {/* Name Edit Dialog */}
        <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-md">
            <DialogHeader>
              <DialogTitle>Edit Name</DialogTitle>
            </DialogHeader>

            <form onSubmit={saveName}>
              <div className="space-y-8">
                <div className="relative">
                  <Input
                    value={tempName.slice(0, 15)}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                    maxLength={15}
                    onFocus={handleInputFocus}
                  />
                  <div className="absolute bottom-[-20px] right-2 bottom-0 text-xs text-gray-500 px-1 rounded">
                    {tempName.slice(0, 15).length}/15
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={closeNameDialog}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    /* onClick={saveName} */
                    disabled={isLoading || !tempName.trim()}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* About Footer */}
      <div className="mt-4">
        <AboutFooter />
      </div>
    </div>
  );
};

export default Profile;
