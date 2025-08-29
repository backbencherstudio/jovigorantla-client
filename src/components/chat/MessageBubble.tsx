import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/components/chat/types";
import { UserRound } from "lucide-react";
import dayjs from 'dayjs';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar: boolean;
  otherUserName: string;
  otherUserAvatar?: string;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  showAvatar,
  otherUserName,
  otherUserAvatar,
  isFirstInGroup,
  isLastInGroup,
}) => {
  // Apply different styling for corners based on position in the group
  const messageBubbleStyle = cn(
    "px-3 py-2 text-sm break-words",
    isCurrentUser ? "bg-[#d9fdd3] text-gray-800" : "bg-white text-gray-800",
    isFirstInGroup && isLastInGroup
      ? isCurrentUser
        ? "rounded-lg rounded-tr-none"
        : "rounded-lg rounded-tl-none"
      : isFirstInGroup
      ? isCurrentUser
        ? "rounded-t-lg rounded-tr-none rounded-bl-lg"
        : "rounded-t-lg rounded-tl-none rounded-br-lg"
      : isLastInGroup
      ? isCurrentUser
        ? "rounded-b-lg rounded-tr-none rounded-bl-lg rounded-tl-lg"
        : "rounded-b-lg rounded-tl-none rounded-tr-lg rounded-br-lg"
      : isCurrentUser
      ? "rounded-l-lg"
      : "rounded-r-lg"
  );

  // console.log("message", message.content);
  // console.log(message)

  return (
    <div
      className={cn(
        "flex gap-2",
        isCurrentUser ? "justify-end" : "justify-start",
        !isLastInGroup ? "mb-0.5" : "mb-2"
      )}
    >
      {/* Other user avatar */}
      {!isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10">
            <UserRound className="h-4 w-4" />
          </AvatarFallback>
          {otherUserAvatar && (
            <AvatarImage src={otherUserAvatar} alt={otherUserName} />
          )}
        </Avatar>
      )}

      {/* Message bubble with WhatsApp style */}
      <div
        className={cn(
          "max-w-[75%] relative",
          !showAvatar && !isCurrentUser && "ml-10"
        )}
      >
        <div className={messageBubbleStyle}>{message.content}</div>

        {/* WhatsApp style timestamp in bubble */}
        {/* {isLastInGroup && (
          <div
            className={cn(
              "text-[10px] text-gray-500 mt-0.5",
              isCurrentUser ? "text-right pr-2" : "text-right pr-2"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )} */}

          {isLastInGroup && (
            <div
              className={cn(
                "text-[10px] text-gray-500 mt-0.5",
                isCurrentUser ? "text-right" : "text-right"
              )}
            >
              {/* {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} */}

              {dayjs(message.timestamp).format('hh:mm A')}
            </div>
          )}

      </div>
    </div>
  );
};

export default MessageBubble;
