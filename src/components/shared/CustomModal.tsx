import React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  icon?: React.ReactNode;
  type?: "success" | "error" | "pending";
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onOpenChange,
  title,
  type,
  icon,
}) => {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="">
        <DialogContent className="rounded-lg">
          <DialogClose className="absolute h-8 w-8 flex justify-center items-center right-4 top-4 rounded-full hover:bg-gray-100 p-2">
            ✕
          </DialogClose>

          <div className="flex flex-col items-center justify-center space-y-6 p-6">
            {icon}

            <div className="text-center space-y-2">
              <h2 className="text-xl lg:text-xl font-semibold">{title}</h2>
            </div>

            {type === "error" ? (
              <Button
                className="w-full bg-[#ff6b00] text-white rounded-full py-6"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Ok
              </Button>
            ) : (
              <Button
                className="w-full bg-[#ff6b00] text-white rounded-full py-6"
                onClick={() => {
                  sessionStorage.removeItem("home_cached_data");
                  sessionStorage.removeItem("home_scroll_position");
                  onOpenChange(false);
                  navigate("/");
                }}
              >
                Browse Listings
              </Button>
            )}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default CustomModal;
