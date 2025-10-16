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

// Change User Name
function canChangeUsername(
  createdAt: Date | string,
  changeCount: number,
  lastChangeDate?: Date | string | null
): {
  canChange: boolean;
  reason: string;
  changesLeft: number;
  maxChanges: number;
  resetInDays?: number;
} {
  const created = new Date(createdAt);
  const now = new Date();
  // Calculate if within first month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const withinFirstMonth = created > oneMonthAgo;
  // Determine max changes based on timeframe
  const maxChanges = withinFirstMonth ? 2 : 1;
  // Check if monthly reset applies (for users after first month)
  if (!withinFirstMonth && lastChangeDate) {
    const lastChange = new Date(lastChangeDate);
    const isNewMonth =
      lastChange.getMonth() !== now.getMonth() ||
      lastChange.getFullYear() !== now.getFullYear();
    if (isNewMonth) {
      return {
        canChange: true,
        reason: "Monthly reset available",
        changesLeft: maxChanges, // Reset counter
        maxChanges,
      };
    }
  }
  // Check if user has changes left
  const changesLeft = maxChanges - changeCount;
  if (changesLeft <= 0) {
    // Calculate days until reset
    let resetInDays: number | undefined;
    if (withinFirstMonth) {
      // Reset when first month ends
      const firstMonthEnd = new Date(created);
      firstMonthEnd.setMonth(firstMonthEnd.getMonth() + 1);
      resetInDays = Math.ceil(
        (firstMonthEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    } else {
      // Reset at start of next month
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      resetInDays = Math.ceil(
        (nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    return {
      canChange: false,
      reason: withinFirstMonth
        ? "First month limit reached (2 changes max)"
        : "Monthly limit reached (1 change per month)",
      changesLeft: 0,
      maxChanges,
      resetInDays,
    };
  }
  return {
    canChange: true,
    reason: withinFirstMonth
      ? `You have ${changesLeft} change(s) left in your first month`
      : `You have ${changesLeft} change(s) left this month`,
    changesLeft,
    maxChanges,
  };
}

const Profile = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    setScrollY(0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      setIsScrolling(false);
    };
  }, []);

  const { user, updateMe } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState("768px");
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [allowedChangeUsername, setAllowedChangeUsername] = useState({});

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

    // Calling User Change Allowed Function
    const changeAllowedFunc = canChangeUsername(
      user.created_at,
      user.name_change_count,
      user.name_change_date
    );

    // console.log(user.created_at, user.name_change_count, user.name_change_date);
    // console.log("Hello22", changeAllowedFunc);

    setAllowedChangeUsername(changeAllowedFunc);

    //console.log("Hello", changeAllowedFunc);
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
    <div className="bg-white min-h-[calc(100vh-110px)] p-2 py-4 pb-0 lg:pb-0 flex flex-col justify-between">
      <div className="px-4 space-y-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2 pt-1">
            <Label htmlFor="name">Display Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="name"
                type="text"
                value={name.slice(0, 15)}
                readOnly
                disabled={!allowedChangeUsername?.canChange}
                onClick={
                  allowedChangeUsername?.canChange ? openNameDialog : undefined
                }
                className={`pl-10 pr-10 ${
                  allowedChangeUsername?.canChange
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
              />
              <ChevronRight
                className="absolute right-3 top-3 h-4 w-4 text-gray-500 cursor-pointer"
                onClick={
                  allowedChangeUsername?.canChange ? openNameDialog : undefined
                }
              />
            </div>
            {allowedChangeUsername?.reason && (
              <p className="text-sm text-gray-500">
                {allowedChangeUsername?.reason}
              </p>
            )}
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

            {/* onSubmit={saveName} */}
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
                  <button
                    className="inline-flex px-3 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    type="button"
                    onClick={closeNameDialog}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>

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
