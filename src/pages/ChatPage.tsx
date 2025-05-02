import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ChatConversation from "@/components/ChatConversation";
import { Message } from "@/components/chat/types";
import { useUnreadMessages } from "@/components/Header";

// Conversation type definition
interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
    sentByCurrentUser: boolean;
  };
  unreadCount: number;
  listingTitle: string;
  listingId: string;
  messages: Message[];
}

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setUnreadMessages } = useUnreadMessages();
  const [conversation, setConversation] = useState<Conversation | null>(null);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: "1",
        otherUser: {
          id: "user1",
          name: "John Smith",
        },
        lastMessage: {
          text: "Is this room still available?",
          timestamp: new Date(Date.now() - 3600000),
          isRead: true,
          sentByCurrentUser: false,
        },
        unreadCount: 0,
        listingTitle: "Room for rent in Downtown area",
        listingId: "101",
        messages: [
          {
            id: "1-1",
            senderId: "user1",
            content: "Hello, is this room still available?",
            timestamp: new Date(Date.now() - 3600000),
            read: true,
          },
          {
            id: "1-2",
            senderId: user?.id || "current-user",
            content:
              "Yes, it is still available. When would you like to see it?",
            timestamp: new Date(Date.now() - 3500000),
            read: true,
          },
        ],
      },
      {
        id: "2",
        otherUser: {
          id: "user2",
          name: "Sarah Johnson",
        },
        lastMessage: {
          text: "I can offer $150 for this.",
          timestamp: new Date(Date.now() - 86400000),
          isRead: false,
          sentByCurrentUser: false,
        },
        unreadCount: 2,
        listingTitle: "Used bicycle for sale",
        listingId: "102",
        messages: [
          {
            id: "2-1",
            senderId: user?.id || "current-user",
            content: "Hi, is the bicycle still available?",
            timestamp: new Date(Date.now() - 90000000),
            read: true,
          },
          {
            id: "2-2",
            senderId: "user2",
            content: "Yes it is. Are you interested?",
            timestamp: new Date(Date.now() - 89000000),
            read: true,
          },
          {
            id: "2-3",
            senderId: user?.id || "current-user",
            content: "How much are you asking for it?",
            timestamp: new Date(Date.now() - 88000000),
            read: true,
          },
          {
            id: "2-4",
            senderId: "user2",
            content: "I was asking for $200 but I can negotiate.",
            timestamp: new Date(Date.now() - 87000000),
            read: true,
          },
          {
            id: "2-5",
            senderId: user?.id || "current-user",
            content: "Would you take $130?",
            timestamp: new Date(Date.now() - 86500000),
            read: true,
          },
          {
            id: "2-6",
            senderId: "user2",
            content: "I can offer $150 for this.",
            timestamp: new Date(Date.now() - 86400000),
            read: false,
          },
          {
            id: "2-7",
            senderId: "user2",
            content: "Does that work for you?",
            timestamp: new Date(Date.now() - 86300000),
            read: false,
          },
        ],
      },
      {
        id: "3",
        otherUser: {
          id: "user3",
          name: "David Brown",
        },
        lastMessage: {
          text: "Can you tell me more about the job?",
          timestamp: new Date(Date.now() - 172800000),
          isRead: true,
          sentByCurrentUser: false,
        },
        unreadCount: 0,
        listingTitle: "Software Developer Job Opening",
        listingId: "103",
        // Mock listing ID
        messages: [
          {
            id: "3-1",
            senderId: user?.id || "current-user",
            content:
              "Hi, I saw your job posting and I have questions about the role.",
            timestamp: new Date(Date.now() - 180000000),
            read: true,
          },
          {
            id: "3-2",
            senderId: "user3",
            content: "Sure, what would you like to know?",
            timestamp: new Date(Date.now() - 179000000),
            read: true,
          },
          {
            id: "3-3",
            senderId: user?.id || "current-user",
            content: "Can you tell me more about the job?",
            timestamp: new Date(Date.now() - 172800000),
            read: true,
          },
        ],
      },
    ];

    // Find the conversation with the matching ID
    const foundConversation = mockConversations.find(
      (conv) => conv.id === conversationId
    );

    if (foundConversation) {
      // Mark all messages as read when opening the conversation
      const updatedConversation = {
        ...foundConversation,
        unreadCount: 0,
        lastMessage: {
          ...foundConversation.lastMessage,
          isRead: true,
        },
        messages: foundConversation.messages.map((msg) => ({
          ...msg,
          read: true,
        })),
      };
      setConversation(updatedConversation);

      // Update total unread count
      const totalUnread = mockConversations.reduce((total, conv) => {
        if (conv.id === conversationId) return total;
        return total + conv.unreadCount;
      }, 0);
      setUnreadMessages(totalUnread);
    } else {
      // If conversation not found, redirect back to messages list
      navigate("/messages");
    }
  }, [conversationId, user?.id, navigate, setUnreadMessages]);

  const handleSendMessage = (content: string) => {
    if (content.trim() && conversation) {
      // Create new message
      const message: Message = {
        id: Date.now().toString(),
        senderId: user?.id || "current-user",
        content: content,
        timestamp: new Date(),
        read: true, // Own messages are always read
      };

      // Update conversation state
      setConversation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, message],
          lastMessage: {
            text: content,
            timestamp: new Date(),
            isRead: true,
            sentByCurrentUser: true,
          },
        };
      });
    }
  };

  const handleBack = () => {
    navigate("/messages");
  };

  if (!conversation) {
    return <div>Loading...</div>;
  }

  return (
    <ChatConversation
      conversationId={conversation.id}
      otherUserName={conversation.otherUser.name}
      listingTitle={conversation.listingTitle}
      listingId={conversation.listingId}
      messages={conversation.messages}
      onSendMessage={handleSendMessage}
      onBack={handleBack}
    />
  );
};

export default ChatPage;
