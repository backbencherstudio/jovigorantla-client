import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChatConversationProps } from "./chat/types";
import ChatHeader from "./chat/ChatHeader";
import MessagesContainer from "./chat/MessagesContainer";
import MessageInput from "./chat/MessageInput";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { useMessages } from "@/context/MessageContext"; // <-- new import
import { api } from "@/lib/axois";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { conversations, markMessagesAsRead, setActiveConversation } =
    useMessages(); // <-- using context

  const conversation = conversations.find((c) => c.id === conversationId);
  const isBlocked = conversation?.isBlocked;
  const blockedByMe = conversation?.blockedByMe;
  const blockedByOther = conversation?.blockedByOther;
  //

  // console.log(conversation, isBlocked)

  // When message is sent
  const handleSendMessage = (content: string) => {
    if (isBlocked) {
      toast.error("You are blocked in this conversation.");
      return;
    }

    if (onSendMessage) {
      onSendMessage(content);
    }
  };

  const handleBlockUser = async () => {
    try {
      await api.patch(`/chat/conversation/${conversationId}/block`);
    } catch (error) {
      toast.error("Failed to block user");
      console.error(error);
    }
  };

  const handleUnblockUser = async () => {
    try {
      const res = await api.patch(
        `/chat/conversation/${conversationId}/unblock`
      );
      if (res.data.success) {
        toast.success("User unblocked successfully");
      }
    } catch (error) {
      toast.error("Failed to unblock user");
      console.error(error);
    }
  };

  function goBackAndRemoveLastEntry() {
    const handler = () => {
      // After going back, replace the current entry with itself
      history.replaceState(history.state, "", location.href);
      window.removeEventListener("popstate", handler);
    };

    // Listen for the popstate triggered by history.back()
    window.addEventListener("popstate", handler);
    history.back();
  }

  // Usage:
  // goBackAndRemoveLastEntry();

  // function removeLastHistoryEntry() {
  //   // Get current state and URL
  //   const currentState = history.state;
  //   const currentUrl = location.href;

  //   console.log("history => ", history, currentState)
  //   // Go back temporarily
  //   // history.back();

  //   // // Immediately replace the previous entry with our current state
  //   // setTimeout(() => {
  //   //   history.replaceState(currentState, '', currentUrl);
  //   // }, 0);
  // }

  const handleDeleteConversation = async () => {
    try {
      const res = await api.delete(
        `/chat/conversation/${conversationId}/soft-delete`
      );
      if (res.data.success) {
        setActiveConversation(null);
        toast.success("Conversation deleted");
        window.history.back();
        window.history.back();
        // window.location.replace('/messages');

        // window.history.replaceState(null, '', '/messages');

        // if (onBack) onBack();
        // goBackAndRemoveLastEntry();
      }
      // removeLastHistoryEntry();
    } catch (error) {
      toast.error("Failed to delete conversation");
      console.error(error);
    }
  };

  const handleReportConversation = () => {
    toast.success("Conversation reported successfully");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isBlocked, blockedByMe, blockedByOther]);

  return (
    <div className="flex flex-col max-h-[calc(100vh-130px)] h-full overflow-hidden bg-gray-100 ">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white">
        <ChatHeader
          otherUserName={otherUserName}
          listingTitle={listingTitle}
          listingId={listingId}
          otherUserAvatar={otherUserAvatar}
          isBlocked={blockedByMe}
          onBack={onBack}
          onBlockUser={handleBlockUser}
          onUnblockUser={handleUnblockUser}
          onReportConversation={handleReportConversation}
          onDeleteConversation={handleDeleteConversation}
          blockedByOther={blockedByOther}
        />
      </div>

      {/* Messages Area */}
      {/* max-h-[calc(100vh-130px)]  chilo, overflow r scrollbar hidden chilo na */}
      {/*  overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-[40px] */}
      <div className="max-h-[calc(100vh-180px)] h-full flex  w-full ">
        {/* {isBlocked && (
          <div className="flex justify-center items-center text-center p-4">
            <Badge variant="destructive">You are blocked in this conversation</Badge>
          </div>
        )} */}
        <MessagesContainer
          messages={messages}
          currentUserId={user?.id || "current-user"}
          otherUserName={otherUserName}
          otherUserAvatar={otherUserAvatar}
        />
      </div>

      {/* Input */}
      {/* <div className="sticky bottom-0 left-0 right-0 z-20 bg-gray-100">
        {!blockedByOther ?
          <MessageInput onSendMessage={handleSendMessage} /> : <div className="flex justify-center items-center text-center p-4">
            <Badge variant="destructive">You are blocked in this conversation</Badge>
          </div>
        }
      </div> */}

      {/* <div className="relative bottom-0 left-0 right-0 z-20 bg-gray-100">
        {!isBlocked ? (
          <MessageInput onSendMessage={handleSendMessage} />
        ) : blockedByOther ? (
          <div className="p-3 bg-[#f0f2f5] absoute bottom-0  border-t border-gray-200 w-full text-center">
            <Badge variant="destructive">You are blocked in this conversation</Badge>
          </div>
        ) : (
          <div className="p-3 bg-[#f0f2f5] absoute bottom-0  border-t border-gray-200 w-full text-center">
           <p>
           You blocked this user.{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline ml-1"
              onClick={handleUnblockUser}
            >
              Unblock
            </span>
           </p>
          </div>
        )}

      </div> */}

      {/* relative bottom-0 left-0 right-0 z-20 bg-gray-100 */}
      <div className="fixed bottom-0 z-20 bg-[#f0f2f5]  w-full mx-auto max-w-3xl md:max-w-[35rem] xl:max-w-[47rem]">
        {!isBlocked ? (
          <MessageInput onSendMessage={handleSendMessage} />
        ) : blockedByMe ? (
          // If I blocked the other user (even if they also blocked me)
          <div className="py-[21px] px-3 bg-[#f0f2f5] border-t border-gray-200 w-full text-center">
            <p>
              You blocked this user.
              <span
                className="text-blue-600 cursor-pointer hover:underline ml-1"
                onClick={handleUnblockUser}
              >
                Unblock
              </span>
            </p>
          </div>
        ) : (
          // I didn’t block them, but they blocked me
          <div className="py-[21px] px-3 bg-[#f0f2f5] border-t border-gray-200 w-full text-center">
            <Badge variant="destructive">
              You are blocked in this conversation
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatConversation;
