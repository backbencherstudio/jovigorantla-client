// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import ChatConversation from "@/components/ChatConversation";
// import { Message } from "@/components/chat/types";
// import { useUnreadMessages } from "@/components/Header";

// // Conversation type definition
// interface Conversation {
//   id: string;
//   otherUser: {
//     id: string;
//     name: string;
//   };
//   lastMessage: {
//     text: string;
//     timestamp: Date;
//     isRead: boolean;
//     sentByCurrentUser: boolean;
//   };
//   unreadCount: number;
//   listingTitle: string;
//   listingId: string;
//   messages: Message[];
// }

// const ChatPage = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { setUnreadMessages } = useUnreadMessages();
//   const [conversation, setConversation] = useState<Conversation | null>(null);

//   // Mock data - in a real app, this would come from an API
//   useEffect(() => {
//     // Mock conversations data
//     const mockConversations: Conversation[] = [
//       {
//         id: "1",
//         otherUser: {
//           id: "user1",
//           name: "John Smith",
//         },
//         lastMessage: {
//           text: "Is this room still available?",
//           timestamp: new Date(Date.now() - 3600000),
//           isRead: true,
//           sentByCurrentUser: false,
//         },
//         unreadCount: 0,
//         listingTitle: "Room for rent in Downtown area",
//         listingId: "101",
//         messages: [
//           {
//             id: "1-1",
//             senderId: "user1",
//             content: "Hello, is this room still available?",
//             timestamp: new Date(Date.now() - 3600000),
//             read: true,
//           },
//           {
//             id: "1-2",
//             senderId: user?.id || "current-user",
//             content:
//               "Yes, it is still available. When would you like to see it?",
//             timestamp: new Date(Date.now() - 3500000),
//             read: true,
//           },
//         ],
//       },
//       {
//         id: "2",
//         otherUser: {
//           id: "user2",
//           name: "Sarah Johnson",
//         },
//         lastMessage: {
//           text: "I can offer $150 for this.",
//           timestamp: new Date(Date.now() - 86400000),
//           isRead: false,
//           sentByCurrentUser: false,
//         },
//         unreadCount: 2,
//         listingTitle: "Used bicycle for sale",
//         listingId: "102",
//         messages: [
//           {
//             id: "2-1",
//             senderId: user?.id || "current-user",
//             content: "Hi, is the bicycle still available?",
//             timestamp: new Date(Date.now() - 90000000),
//             read: true,
//           },
//           {
//             id: "2-2",
//             senderId: "user2",
//             content: "Yes it is. Are you interested?",
//             timestamp: new Date(Date.now() - 89000000),
//             read: true,
//           },
//           {
//             id: "2-3",
//             senderId: user?.id || "current-user",
//             content: "How much are you asking for it?",
//             timestamp: new Date(Date.now() - 88000000),
//             read: true,
//           },
//           {
//             id: "2-4",
//             senderId: "user2",
//             content: "I was asking for $200 but I can negotiate.",
//             timestamp: new Date(Date.now() - 87000000),
//             read: true,
//           },
//           {
//             id: "2-5",
//             senderId: user?.id || "current-user",
//             content: "Would you take $130?",
//             timestamp: new Date(Date.now() - 86500000),
//             read: true,
//           },
//           {
//             id: "2-6",
//             senderId: "user2",
//             content: "I can offer $150 for this.",
//             timestamp: new Date(Date.now() - 86400000),
//             read: false,
//           },
//           {
//             id: "2-7",
//             senderId: "user2",
//             content: "Does that work for you?",
//             timestamp: new Date(Date.now() - 86300000),
//             read: false,
//           },
//         ],
//       },
//       {
//         id: "3",
//         otherUser: {
//           id: "user3",
//           name: "David Brown",
//         },
//         lastMessage: {
//           text: "Can you tell me more about the job?",
//           timestamp: new Date(Date.now() - 172800000),
//           isRead: true,
//           sentByCurrentUser: false,
//         },
//         unreadCount: 0,
//         listingTitle: "Software Developer Job Opening",
//         listingId: "103",
//         // Mock listing ID
//         messages: [
//           {
//             id: "3-1",
//             senderId: user?.id || "current-user",
//             content:
//               "Hi, I saw your job posting and I have questions about the role.",
//             timestamp: new Date(Date.now() - 180000000),
//             read: true,
//           },
//           {
//             id: "3-2",
//             senderId: "user3",
//             content: "Sure, what would you like to know?",
//             timestamp: new Date(Date.now() - 179000000),
//             read: true,
//           },
//           {
//             id: "3-3",
//             senderId: user?.id || "current-user",
//             content: "Can you tell me more about the job?",
//             timestamp: new Date(Date.now() - 172800000),
//             read: true,
//           },
//         ],
//       },
//     ];

//     // Find the conversation with the matching ID
//     const foundConversation = mockConversations.find(
//       (conv) => conv.id === conversationId
//     );

//     if (foundConversation) {
//       // Mark all messages as read when opening the conversation
//       const updatedConversation = {
//         ...foundConversation,
//         unreadCount: 0,
//         lastMessage: {
//           ...foundConversation.lastMessage,
//           isRead: true,
//         },
//         messages: foundConversation.messages.map((msg) => ({
//           ...msg,
//           read: true,
//         })),
//       };
//       setConversation(updatedConversation);

//       // Update total unread count
//       const totalUnread = mockConversations.reduce((total, conv) => {
//         if (conv.id === conversationId) return total;
//         return total + conv.unreadCount;
//       }, 0);
//       setUnreadMessages(totalUnread);
//     } else {
//       // If conversation not found, redirect back to messages list
//       // navigate("/messages");
//     }
//   }, [conversationId, user?.id, navigate, setUnreadMessages]);

//   const handleSendMessage = (content: string) => {
//     if (content.trim() && conversation) {
//       // Create new message
//       const message: Message = {
//         id: Date.now().toString(),
//         senderId: user?.id || "current-user",
//         content: content,
//         timestamp: new Date(),
//         read: true, // Own messages are always read
//       };

//       // Update conversation state
//       setConversation((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           messages: [...prev.messages, message],
//           lastMessage: {
//             text: content,
//             timestamp: new Date(),
//             isRead: true,
//             sentByCurrentUser: true,
//           },
//         };
//       });
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   if (!conversation) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <ChatConversation
//       conversationId={conversation.id}
//       otherUserName={conversation.otherUser.name}
//       listingTitle={conversation.listingTitle}
//       listingId={conversation.listingId}
//       messages={conversation.messages}
//       onSendMessage={handleSendMessage}
//       onBack={handleBack}
//     />
//   );
// };

// export default ChatPage;


// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import ChatConversation from "@/components/ChatConversation";
// import { Message } from "@/components/chat/types";
// import { useUnreadMessages } from "@/components/Header";
// import { useSocket } from "@/context/SocketContext"; // ✅ import useSocket

// interface Conversation {
//   id: string;
//   otherUser: {
//     id: string;
//     name: string;
//   };
//   lastMessage: {
//     text: string;
//     timestamp: Date;
//     isRead: boolean;
//     sentByCurrentUser: boolean;
//   };
//   unreadCount: number;
//   listingTitle: string;
//   listingId: string;
//   messages: Message[];
// }

// const ChatPage = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { setUnreadMessages } = useUnreadMessages();
//   const { socket } = useSocket(); // ✅ get socket
//   const [conversation, setConversation] = useState<Conversation | null>(null);

//   useEffect(() => {
//       // setConversation();
//   }, [conversationId, user?.id, navigate, setUnreadMessages, socket]);

//   useEffect(() => {
//     if (!socket || !user?.id) return;

//     // ✅ Listen to message_read events sent to this user
//     socket.on("message_read", ({ conversationId, messageId }) => {
//       console.log("Message read in", conversationId, messageId);
//       setConversation((prev) => {
//         if (!prev || prev.id !== conversationId) return prev;

//         const updatedMessages = prev.messages.map((msg) =>
//           msg.id === messageId ? { ...msg, read: true } : msg
//         );

//         return { ...prev, messages: updatedMessages };
//       });
//     });

//     return () => {
//       socket.off("message_read");
//     };
//   }, [socket, user?.id]);

//   const handleSendMessage = (content: string) => {
//     if (content.trim() && conversation) {
//       const message: Message = {
//         id: Date.now().toString(),
//         senderId: user?.id || "current-user",
//         content: content,
//         timestamp: new Date(),
//         read: true,
//       };

//       setConversation((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           messages: [...prev.messages, message],
//           lastMessage: {
//             text: content,
//             timestamp: new Date(),
//             isRead: true,
//             sentByCurrentUser: true,
//           },
//         };
//       });
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   if (!conversation) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <ChatConversation
//       conversationId={conversation.id}
//       otherUserName={conversation.otherUser.name}
//       listingTitle={conversation.listingTitle}
//       listingId={conversation.listingId}
//       messages={conversation.messages}
//       onSendMessage={handleSendMessage}
//       onBack={handleBack}
//     />
//   );
// };

// export default ChatPage;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { useSocket } from "@/context/SocketContext"; 
// import { useUnreadMessages } from "@/components/Header";
// import { Message } from "@/components/chat/types";
// import ChatConversation from "@/components/ChatConversation"; 
// import { api } from "@/lib/axois";


// // Conversation type definition
// // interface Conversation {
// //   id: string;
// //   otherUser: {
// //     id: string;
// //     name: string;
// //   };
// //   lastMessage: {
// //     text: string;
// //     timestamp: Date;
// //     isRead: boolean;
// //     sentByCurrentUser: boolean;
// //   };
// //   unreadCount: number;
// //   listingTitle: string;
// //   listingId: string;
// //   messages: Message[];
// // }

// const ChatPage = () => {
//   const { conversationId } = useParams();  // Get conversation ID from URL params
//   const navigate = useNavigate();
//   const { user } = useAuth();  // Get the authenticated user
//   const { setUnreadMessages } = useUnreadMessages();  // To update unread message count
//   const { socket } = useSocket(); // Get socket instance

//   const [conversation, setConversation] = useState(null);

//   useEffect(() => {
//     if (!conversationId || !user?.id) return;

//     const fetchConversation = async () => {
//       try {
//         // Fetch conversation data from API
//         const response = await api.get(`/chat/conversation/${conversationId}`);
//         const { data } = response;

//         console.log(data)

//         // Update conversation state
//         // const updatedConversation = {
//         //   ...data,
//         //   unreadCount: 0,  // Mark unread messages as read when conversation is opened
//         //   lastMessage: { ...data.lastMessage, isRead: true },  // Mark last message as read
//         //   messages: data.messages.map((msg: any) => ({ ...msg, read: true }))  // Mark all messages as read
//         // };

//         // setConversation(updatedConversation);

//         // // Update total unread messages count
//         // const totalUnread = data.conversations.reduce((total: number, conv: any) => {
//         //   if (conv.id === conversationId) return total;
//         //   return total + conv.unreadCount;
//         // }, 0);
//         // setUnreadMessages(totalUnread);
//       } catch (error) {
//         console.error("Failed to fetch conversation data:", error);
//         // Optionally handle API errors, like redirecting back or showing an error message
//       }
//     };

//     fetchConversation();
//   }, [conversationId, user?.id, setUnreadMessages]);

//   // Format message timestamp into a readable format
//   const formatMessageTime = (date: Date) => {
//     const now = new Date();
//     const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
//     if (diffInMinutes < 1) return "now";
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours}h ago`;
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays < 7) return `${diffInDays}d ago`;
//     return `${Math.floor(diffInDays / 7)}w ago`;
//   };

//   // Handle sending a message
//   const handleSendMessage = (content: string) => {
//     if (content.trim() && conversation) {
//       const newMessage: Message = {
//         id: Date.now().toString(),
//         senderId: user?.id || "current-user",
//         content: content,
//         timestamp: new Date(),
//         read: true  // Set read to true for own messages
//       };

//       setConversation(prev => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           messages: [...prev.messages, newMessage],
//           lastMessage: {
//             text: content,
//             timestamp: new Date(),
//             isRead: true,
//             sentByCurrentUser: true
//           }
//         };
//       });

//       // Emit the new message to the server through socket
//       socket?.emit("sendMessage", { to: conversation.otherUser.id, data: newMessage });
//     }
//   };

//   // Handle back navigation
//   const handleBack = () => {
//     navigate(-1);
//   };

//   if (!conversation) {
//     return <div>Loading...</div>; // Show a loading indicator while the conversation data is being fetched
//   }

//   return (
//     <ChatConversation
//       conversationId={conversation.id}
//       otherUserName={conversation.otherUser.name}
//       listingTitle={conversation.listingTitle}
//       listingId={conversation.listingId}
//       messages={conversation.messages}
//       onSendMessage={handleSendMessage}
//       onBack={handleBack}
//     />
//   );
// };

// export default ChatPage;


// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import ChatConversation from "@/components/ChatConversation";
// import { Message } from "@/components/chat/types";
// import { useUnreadMessages } from "@/components/Header";
// import { useMessages } from "@/context/MessageContext";
// import { api } from "@/lib/axois";

// // Conversation type definition
// // interface Conversation {
// //   id: string;
// //   other: {
// //     id: string;
// //     name: string;
// //   };
// //   lastMessage: {
// //     text: string;
// //     timestamp: Date;
// //     isRead: boolean;
// //     sentByCurrentUser: boolean;
// //   };
// //   unreadCount: number;
// //   listingTitle: string;
// //   listingId: string;
// //   messages: Message[];
// // }

// const ChatPage = () => {
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { setUnreadMessages } = useUnreadMessages();
//   const [conversation, setConversation] = useState(null);
//   const {conversations } = useMessages()

//   // Mock data - in a real app, this would come from an API
//   useEffect(() => {
//     // Mock conversations data
//     const mockConversations = [
//       {
//         id: "1",
//         otherUser: {
//           id: "user1",
//           name: "John Smith",
//         },
//         lastMessage: {
//           text: "Is this room still available?",
//           timestamp: new Date(Date.now() - 3600000),
//           isRead: true,
//           sentByCurrentUser: false,
//         },
//         unreadCount: 0,
//         listingTitle: "Room for rent in Downtown area",
//         listingId: "101",
//         messages: [
//           {
//             id: "1-1",
//             senderId: "user1",
//             content: "Hello, is this room still available?",
//             timestamp: new Date(Date.now() - 3600000),
//             read: true,
//           },
//           {
//             id: "1-2",
//             senderId: user?.id || "current-user",
//             content:
//               "Yes, it is still available. When would you like to see it?",
//             timestamp: new Date(Date.now() - 3500000),
//             read: true,
//           },
//         ],
//       },
//       {
//         id: "2",
//         otherUser: {
//           id: "user2",
//           name: "Sarah Johnson",
//         },
//         lastMessage: {
//           text: "I can offer $150 for this.",
//           timestamp: new Date(Date.now() - 86400000),
//           isRead: false,
//           sentByCurrentUser: false,
//         },
//         unreadCount: 2,
//         listingTitle: "Used bicycle for sale",
//         listingId: "102",
//         messages: [
//           {
//             id: "2-1",
//             senderId: user?.id || "current-user",
//             content: "Hi, is the bicycle still available?",
//             timestamp: new Date(Date.now() - 90000000),
//             read: true,
//           },
//           {
//             id: "2-2",
//             senderId: "user2",
//             content: "Yes it is. Are you interested?",
//             timestamp: new Date(Date.now() - 89000000),
//             read: true,
//           },
//           {
//             id: "2-3",
//             senderId: user?.id || "current-user",
//             content: "How much are you asking for it?",
//             timestamp: new Date(Date.now() - 88000000),
//             read: true,
//           },
//           {
//             id: "2-4",
//             senderId: "user2",
//             content: "I was asking for $200 but I can negotiate.",
//             timestamp: new Date(Date.now() - 87000000),
//             read: true,
//           },
//           {
//             id: "2-5",
//             senderId: user?.id || "current-user",
//             content: "Would you take $130?",
//             timestamp: new Date(Date.now() - 86500000),
//             read: true,
//           },
//           {
//             id: "2-6",
//             senderId: "user2",
//             content: "I can offer $150 for this.",
//             timestamp: new Date(Date.now() - 86400000),
//             read: false,
//           },
//           {
//             id: "2-7",
//             senderId: "user2",
//             content: "Does that work for you?",
//             timestamp: new Date(Date.now() - 86300000),
//             read: false,
//           },
//         ],
//       },
//       {
//         id: "3",
//         otherUser: {
//           id: "user3",
//           name: "David Brown",
//         },
//         lastMessage: {
//           text: "Can you tell me more about the job?",
//           timestamp: new Date(Date.now() - 172800000),
//           isRead: true,
//           sentByCurrentUser: false,
//         },
//         unreadCount: 0,
//         listingTitle: "Software Developer Job Opening",
//         listingId: "103",
//         // Mock listing ID
//         messages: [
//           {
//             id: "3-1",
//             senderId: user?.id || "current-user",
//             content:
//               "Hi, I saw your job posting and I have questions about the role.",
//             timestamp: new Date(Date.now() - 180000000),
//             read: true,
//           },
//           {
//             id: "3-2",
//             senderId: "user3",
//             content: "Sure, what would you like to know?",
//             timestamp: new Date(Date.now() - 179000000),
//             read: true,
//           },
//           {
//             id: "3-3",
//             senderId: user?.id || "current-user",
//             content: "Can you tell me more about the job?",
//             timestamp: new Date(Date.now() - 172800000),
//             read: true,
//           },
//         ],
//       },
//     ];

//     // Find the conversation with the matching ID
//     const foundConversation = conversations.find(
//       (conv) => conv.id === conversationId
//     );

//     console.log(foundConversation)
//     setConversation(foundConversation)


//     if (foundConversation) {
//       // Mark all messages as read when opening the conversation
//       const updatedConversation = {
//         ...foundConversation,
//         unreadCount: 0,
//         lastMessage: {
//           ...foundConversation.lastMessage,
//           isRead: true,
//         },
//         messages: foundConversation.messages.map((msg) => ({
//           ...msg,
//           read: true,
//         })),
//       };
//       setConversation(updatedConversation);

//       // Update total unread count
//       const totalUnread = mockConversations.reduce((total, conv) => {
//         if (conv.id === conversationId) return total;
//         return total + conv.unreadCount;
//       }, 0);
//       setUnreadMessages(totalUnread);
//     } else {
//       // If conversation not found, redirect back to messages list
//       // navigate("/messages");
//     }
//   }, [conversationId, user?.id, navigate, setUnreadMessages]);

//   const handleSendMessage = async(content: string) => {
//     if (content.trim() && conversation) {

//       const {data} = await api.post('chat/message', {
//         conversation_id: conversationId,
//         messagte: content,
//         receiver_id: conversation.other.id,
//       })

//       console.log("chat => ", conversation.other.id, user?.id)

//       console.log(data)
//       // Create new message
//       const message: Message = {
//         id: Date.now().toString(),
//         senderId: user?.id || "current-user",
//         content: content,
//         timestamp: new Date(),
//         read: true, // Own messages are always read
//       };

//       // Update conversation state
//       setConversation((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           messages: [...prev.messages, message],
//           lastMessage: {
//             text: content,
//             timestamp: new Date(),
//             isRead: true,
//             sentByCurrentUser: true,
//           },
//         };
//       });
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   // if (!conversation) {
//   //   return ;
//   // }

//   console.log(conversation)

//   return (
//     <ChatConversation
//       conversationId={conversation.id}
//       otherUserName={conversation?.other?.name}
//       listingTitle={conversation.listing.title}
//       listingId={conversation.listing.id}
//       messages={conversation.messages}
//       onSendMessage={handleSendMessage}
//       onBack={handleBack}
//     />
//   );
// };

// export default ChatPage;



import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ChatConversation from "@/components/ChatConversation";
import { useMessages } from "@/context/MessageContext";
import { api } from "@/lib/axois";
import { Message } from "@/types/chat";
import utcToLocalDate from "@/utils/utcToLocalDate";
import usePreviousRoute from "@/hooks/usePreviousRoute";

// Conversation type definition
interface Conversation {
  id: string;
  other: {
    id: string;
    name: string;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
    sentByCurrentUser: boolean;
  };
  listing: {
    id: string;
    title: string;
  }
  unreadCount: number;
  listingTitle: string;
  listingId: string;
  messages: Message[];
}

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations, setActiveConversation, activeConversation, addMessage, handleSetUnreadMessages } = useMessages();
  const prevRoute = usePreviousRoute();
  // const [conversation, setConversation] = useState<Conversation | null>(null);

  // useEffect(() => {
  //   // Fetching conversation from state or API
  //   const foundConversation = conversations.find(
  //     (conv) => conv.id === conversationId
  //   );

  //   if (foundConversation) {
  //     setConversation(foundConversation);
  //     // Mark messages as read when the conversation is opened
  //     const updatedConversation = {
  //       ...foundConversation,
  //       unreadCount: 0,
  //       lastMessage: {
  //         ...foundConversation.lastMessage,
  //         isRead: true,
  //       },
  //       messages: foundConversation.messages.map((msg) => ({
  //         ...msg,
  //         read: true,
  //       })),
  //     };
  //     setConversation(updatedConversation);

  //     // Update the unread messages count globally
  //     const totalUnread = conversations.reduce((total, conv) => {
  //       if (conv.id === conversationId) return total;
  //       return total + conv.unreadCount;
  //     }, 0);
  //     setUnreadMessages(totalUnread);
  //   } else {
  //     // If conversation not found, redirect to the messages list
  //     navigate("/messages");
  //   }
  // }, [conversationId, conversations, user?.id, navigate, setUnreadMessages]);

  useEffect(() => {
    const foundConversation = conversations.find(
      (conv) => conv.id === conversationId
    );

    if (foundConversation) {
      // setConversation(foundConversation);
      setActiveConversation(foundConversation)
    } else {
      // If conversation not found, redirect to the messages list
      navigate("/messages");
    }
  }, [conversationId, conversations, setActiveConversation, navigate]);

  const handleSendMessage = async (content: string) => {
    if (content.trim() && activeConversation) {
      try {
        // Make API call to send the message
        const { data } = await api.post("/chat/message", {
          conversation_id: conversationId,
          message: content,
          receiver_id: activeConversation.other.id,
        });

        console.log(data)

        // Create a new message object
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: user?.id || "current-user",
          content: content,
          timestamp: utcToLocalDate(data?.data?.created_at) || new Date(),
          created_at: utcToLocalDate(data?.data?.created_at) || new Date(),
          receiver_id: data?.data?.receiver_id || "",
          read: true, // Marking own messages as read
        };

        // Add the new message to the conversation
        addMessage(conversationId, newMessage);


        // Update conversation state with the new message
        // setConversation((prev) => {
        //   if (!prev) return null;
        //   return {
        //     ...prev,
        //     messages: [...prev.messages, newMessage],
        //     lastMessage: {
        //       text: content,
        //       timestamp: new Date(),
        //       isRead: true,
        //       sentByCurrentUser: true,
        //     },
        //   };
        // });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleBack = () => {
    handleSetUnreadMessages(conversationId, 0)
    setActiveConversation(null)
    // navigate('/messages', { replace: true });
    // console.log(prevRoute)
    navigate(-1); // Go back to the previous page
    // window.history.back();
  };

  if (!activeConversation) {
    return <div>Loading...</div>; // Show a loading state until the conversation is available
  }

  return (
    <ChatConversation
      conversationId={activeConversation.id}
      otherUserName={activeConversation.other?.name}
      listingTitle={activeConversation.listing.title}
      listingId={activeConversation.listing.id}
      messages={activeConversation.messages}
      onSendMessage={handleSendMessage}
      onBack={handleBack}
    />
  );
};

export default ChatPage;
