import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChatConversationProps } from "./chat/types";
import ChatHeader from "./chat/ChatHeader";
import MessagesContainer from "./chat/MessagesContainer";
import MessageInput from "./chat/MessageInput";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

const ChatConversation: React.FC<ChatConversationProps> = ({
  conversationId,
  otherUserName,
  listingTitle,
  listingId,
  otherUserAvatar,
  messages = [],
  onSendMessage,
  onBack,
}) => {
  const { user } = useAuth();

  // Mock messages for demo if no messages are provided
  const mockMessages = [
    {
      id: "1",
      senderId: "other-user",
      content: "Hello, is this room still available?",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: "2",
      senderId: user?.id || "current-user",
      content: "Yes, it is still available. When would you like to see it?",
      timestamp: new Date(Date.now() - 3500000),
      read: true,
    },
    {
      id: "3",
      senderId: "other-user",
      content: "Is it possible to see it this weekend?",
      timestamp: new Date(Date.now() - 1800000),
      read: true,
    },
    {
      id: "4",
      senderId: user?.id || "current-user",
      content: "Yes, Saturday morning would work for me. How about 10am?",
      timestamp: new Date(Date.now() - 1700000),
      read: true,
    },
    {
      id: "5",
      senderId: "other-user",
      content: "That works perfectly for me. Can you send me the address?",
      timestamp: new Date(Date.now() - 1600000),
      read: true,
    },
    {
      id: "6",
      senderId: user?.id || "current-user",
      content:
        "123 Main St, Apartment 4B. There's visitor parking available in front.",
      timestamp: new Date(Date.now() - 1500000),
      read: true,
    },
  ];

  const displayMessages = messages.length > 0 ? messages : mockMessages;

  // Handle message sending
  const handleSendMessage = (content: string) => {
    if (onSendMessage) {
      onSendMessage(content);
    } else {
      // Add mock message when no handler is provided
      mockMessages.push({
        id: Date.now().toString(),
        senderId: user?.id || "current-user",
        content: content,
        timestamp: new Date(),
        read: false,
      });
    }
  };

  // Handle conversation actions
  const handleBlockUser = () => {
    toast.success("User blocked successfully");
  };

  const handleReportConversation = () => {
    toast.success("Conversation reported successfully");
  };

  const handleDeleteConversation = () => {
    toast.success("Conversation deleted successfully");
    if (onBack) onBack();
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-gray-100">
      {/* Header - Fixed at top */}
      <div className="sticky top-0 z-20 bg-white">
        <ChatHeader
          otherUserName={otherUserName}
          listingTitle={listingTitle}
          listingId={listingId}
          otherUserAvatar={otherUserAvatar}
          onBack={onBack}
          onBlockUser={handleBlockUser}
          onReportConversation={handleReportConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      {/* Messages - Scrollable area */}
      <div className="flex-1 overflow-y-auto h-full">
        <MessagesContainer
          messages={displayMessages}
          currentUserId={user?.id || "current-user"}
          otherUserName={otherUserName}
          otherUserAvatar={otherUserAvatar}
        />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="sticky bottom-0 left-0 right-0 z-20 bg-gray-100">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatConversation;
