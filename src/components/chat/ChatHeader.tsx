import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  otherUserName: string;
  listingTitle: string;
  listingId?: string;
  otherUserAvatar?: string;
  onBack?: () => void;
  onBlockUser?: () => void;
  onReportConversation?: () => void;
  onDeleteConversation?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  otherUserName,
  listingTitle,
  listingId,
  otherUserAvatar,
  onBack,
  onBlockUser,
  onReportConversation,
  onDeleteConversation,
}) => {
  const navigate = useNavigate();

  const handleListingClick = () => {
    if (listingId) {
      navigate(`/listing/${listingId}`);
    }
  };
  const [width, setWidth] = useState("768px");
  useEffect(() => {
    // Function to update width based on screen size
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024 && screenWidth < 1300) {
        setWidth(`${screenWidth - 540}px`);
      } else if (screenWidth <= 840 && screenWidth > 768) {
        setWidth(`${screenWidth - 100}px`);
      } else if (screenWidth < 768) {
        setWidth(`${screenWidth - 10}px`);
      } else {
        setWidth("768px");
      }
    };
    // Set initial width
    updateWidth();
    // Add event listener for window resize
    window.addEventListener("resize", updateWidth);
    // Clean up event listener
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      style={{ width: width }}
      className="p-3 bg-white border-t flex items-center justify-between fixed  top-[66px] z-10"
    >
      <div className="flex items-center flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 rounded-full hover:bg-gray-100"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10">
            <UserRound className="h-5 w-5" />
          </AvatarFallback>
          {otherUserAvatar && <AvatarImage src={otherUserAvatar} />}
        </Avatar>

        <div className="ml-3 flex-1">
          <h3 className="font-medium text-base">{otherUserName}</h3>
          <p
            className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-sm cursor-pointer hover:underline"
            onClick={handleListingClick}
          >
            {listingTitle}
          </p>
        </div>
      </div>

      {/* Options menu for conversation actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onBlockUser} className="cursor-pointer ">
            Block User
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={onReportConversation}
            className="cursor-pointer"
          >
            Report
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={onDeleteConversation}
            className="cursor-pointer text-[#bc0117]"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
