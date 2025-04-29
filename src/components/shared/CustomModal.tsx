import React from 'react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Timer } from 'lucide-react';

interface CustomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  icon?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onOpenChange , title ,icon }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" rounded-lg">
        <DialogClose className="absolute h-8 w-8 flex justify-center items-center right-4 top-4 rounded-full hover:bg-gray-100 p-2">
          <span className="sr-only">Close</span>
          ✕
        </DialogClose>
        
        <div className="flex flex-col items-center justify-center space-y-6 p-6">
          <Timer className="h-16 w-16 text-[#ff6b00]" />
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">
              {title}
            </h2>
          </div>

          <Button 
            className="w-full bg-[#ff6b00] hover:bg-[#e55f00] text-white rounded-full py-6"
            onClick={() => onOpenChange(false)}
          >
            Browse Listings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;