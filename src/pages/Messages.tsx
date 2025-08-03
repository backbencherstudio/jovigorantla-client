// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useMediaQuery } from "@/hooks/use-media-query";
// import { formatDistanceToNow } from "date-fns";
// import { ArrowLeft, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useNavigate } from "react-router-dom";
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
//     sentByCurrentUser: boolean; // Track who sent the last message
//   };
//   unreadCount: number;
//   listingTitle: string;
//   listingId: string;
//   messages: Message[];
// }

// const Messages = () => {
//   const { user } = useAuth();
//   const [activeConversation, setActiveConversation] = useState<string | null>(
//     null
//   );
//   const isMobile = useMediaQuery("(max-width: 767px)");
//   const navigate = useNavigate();
//   const { unreadMessages, setUnreadMessages } = useUnreadMessages();

//   // Mock conversations data
//   const [conversations, setConversations] = useState<Conversation[]>([
//     {
//       id: "1",
//       otherUser: {
//         id: "user1",
//         name: "John Smith",
//       },
//       lastMessage: {
//         text: "Is this room still available?",
//         timestamp: new Date(Date.now() - 3600000),
//         isRead: true,
//         sentByCurrentUser: false,
//       },
//       unreadCount: 0,
//       listingTitle: "Room for rent in Downtown area",
//       listingId: "101",
//       // Mock listing ID
//       messages: [
//         {
//           id: "1-1",
//           senderId: "user1",
//           content: "Hello, is this room still available?",
//           timestamp: new Date(Date.now() - 3600000),
//           read: true,
//         },
//         {
//           id: "1-2",
//           senderId: user?.id || "current-user",
//           content: "Yes, it is still available. When would you like to see it?",
//           timestamp: new Date(Date.now() - 3500000),
//           read: true,
//         },
//       ],
//     },
//     {
//       id: "2",
//       otherUser: {
//         id: "user2",
//         name: "Sarah Johnson",
//       },
//       lastMessage: {
//         text: "I can offer $150 for this.",
//         timestamp: new Date(Date.now() - 86400000),
//         isRead: false,
//         sentByCurrentUser: false,
//       },
//       unreadCount: 2,
//       listingTitle: "Used bicycle for sale",
//       listingId: "102",
//       // Mock listing ID
//       messages: [
//         {
//           id: "2-1",
//           senderId: user?.id || "current-user",
//           content: "Hi, is the bicycle still available?",
//           timestamp: new Date(Date.now() - 90000000),
//           read: true,
//         },
//         {
//           id: "2-2",
//           senderId: "user2",
//           content: "Yes it is. Are you interested?",
//           timestamp: new Date(Date.now() - 89000000),
//           read: true,
//         },
//         {
//           id: "2-3",
//           senderId: user?.id || "current-user",
//           content: "How much are you asking for it?",
//           timestamp: new Date(Date.now() - 88000000),
//           read: true,
//         },
//         {
//           id: "2-4",
//           senderId: "user2",
//           content: "I was asking for $200 but I can negotiate.",
//           timestamp: new Date(Date.now() - 87000000),
//           read: true,
//         },
//         {
//           id: "2-5",
//           senderId: user?.id || "current-user",
//           content: "Would you take $130?",
//           timestamp: new Date(Date.now() - 86500000),
//           read: true,
//         },
//         {
//           id: "2-6",
//           senderId: "user2",
//           content: "I can offer $150 for this.",
//           timestamp: new Date(Date.now() - 86400000),
//           read: false,
//         },
//         {
//           id: "2-7",
//           senderId: "user2",
//           content: "Does that work for you?",
//           timestamp: new Date(Date.now() - 86300000),
//           read: false,
//         },
//       ],
//     },
//     {
//       id: "3",
//       otherUser: {
//         id: "user3",
//         name: "David Brown",
//       },
//       lastMessage: {
//         text: "Can you tell me more about the job?",
//         timestamp: new Date(Date.now() - 172800000),
//         isRead: true,
//         sentByCurrentUser: false,
//       },
//       unreadCount: 0,
//       listingTitle: "Software Developer Job Opening",
//       listingId: "103",
//       // Mock listing ID
//       messages: [
//         {
//           id: "3-1",
//           senderId: user?.id || "current-user",
//           content:
//             "Hi, I saw your job posting and I have questions about the role.",
//           timestamp: new Date(Date.now() - 180000000),
//           read: true,
//         },
//         {
//           id: "3-2",
//           senderId: "user3",
//           content: "Sure, what would you like to know?",
//           timestamp: new Date(Date.now() - 179000000),
//           read: true,
//         },
//         {
//           id: "3-3",
//           senderId: user?.id || "current-user",
//           content: "Can you tell me more about the job?",
//           timestamp: new Date(Date.now() - 172800000),
//           read: true,
//         },
//       ],
//     },
//   ]);

//   // Calculate total unread count for notification badge and sync with header
//   useEffect(() => {
//     const count = conversations.reduce(
//       (total, conv) => total + conv.unreadCount,
//       0
//     );
//     setUnreadMessages(count);
//   }, [conversations, setUnreadMessages]);

//   // Format time in a brief, readable format
//   const formatMessageTime = (date: Date) => {
//     const now = new Date();
//     const diffInMinutes = Math.floor(
//       (now.getTime() - date.getTime()) / (1000 * 60)
//     );
//     if (diffInMinutes < 1) return "now";
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     if (diffInHours < 24) return `${diffInHours}h ago`;
//     const diffInDays = Math.floor(diffInHours / 24);
//     if (diffInDays < 7) return `${diffInDays}d ago`;
//     return `${Math.floor(diffInDays / 7)}w ago`;
//   };

//   // Find active conversation
//   const activeConversationData = conversations.find(
//     (conv) => conv.id === activeConversation
//   );

//   // Mark messages as read when opening conversation
//   useEffect(() => {
//     if (activeConversation) {
//       setConversations((prevConversations) =>
//         prevConversations.map((conv) => {
//           if (conv.id === activeConversation) {
//             // Mark all messages as read
//             const updatedMessages = conv.messages.map((msg) => ({
//               ...msg,
//               read: true,
//             }));

//             return {
//               ...conv,
//               unreadCount: 0,
//               lastMessage: {
//                 ...conv.lastMessage,
//                 isRead: true,
//               },
//               messages: updatedMessages,
//             };
//           }
//           return conv;
//         })
//       );
//     }
//   }, [activeConversation]);

//   // Handle sending a message
//   const handleSendMessage = (content: string) => {
//     if (content.trim() && activeConversation) {
//       // Create new message
//       const message: Message = {
//         id: Date.now().toString(),
//         senderId: user?.id || "current-user",
//         content: content,
//         timestamp: new Date(),
//         read: true, // Own messages are always read
//       };

//       // Update conversations state
//       setConversations((prevConversations) =>
//         prevConversations.map((conv) => {
//           if (conv.id === activeConversation) {
//             return {
//               ...conv,
//               messages: [...conv.messages, message],

//               lastMessage: {
//                 text: content,
//                 timestamp: new Date(),
//                 isRead: true, // Own messages are always read
//                 sentByCurrentUser: true, // Important: Mark as sent by current user
//               },
//             };
//           }
//           return conv;
//         })
//       );

//       toast.success("Message sent");
//     }
//   };

//   const handleBack = () => {
//     setActiveConversation(null);
//     navigate(-1);
//   };

//   // Handle listing title click
//   const handleListingClick = (listingId: string) => {
//     navigate(`/listing/${listingId}`);
//   };

//   const handleConversationSelect = (conversationId: string) => {
//     // Mark the selected conversation as read before navigating
//     setConversations((prevConversations) =>
//       prevConversations.map((conv) => {
//         if (conv.id === conversationId) {
//           return {
//             ...conv,
//             unreadCount: 0,
//             lastMessage: {
//               ...conv.lastMessage,
//               isRead: true,
//             },
//             messages: conv.messages.map((msg) => ({
//               ...msg,
//               read: true,
//             })),
//           };
//         }
//         return conv;
//       })
//     );

//     // Update total unread count in header
//     const updatedTotalUnread = conversations.reduce((total, conv) => {
//       if (conv.id === conversationId) return total;
//       return total + conv.unreadCount;
//     }, 0);
//     setUnreadMessages(updatedTotalUnread);

//     // Navigate to the conversation
//     navigate(`/messages/${conversationId}`);
//   };

//   // Single column layout - always show either conversation list or active conversation
//   return (
//     <div className="h-[85vh] flex flex-col bg-white">
//       {/* Conversations List (shown when no active conversation) */}
//       {!activeConversation && (
//         <div className="w-full h-full flex flex-col">
//           <div className="flex-1 overflow-y-auto">
//             {conversations.length === 0 ? (
//               <div className="flex items-center justify-center h-full p-4 text-gray-500">
//                 No messages yet
//               </div>
//             ) : (
//               <ul className="divide-y divide-gray-100">
//                 {conversations.map((conv) => (
//                   <li
//                     key={conv.id}
//                     className={`cursor-pointer ${
//                       !conv.lastMessage.isRead &&
//                       !conv.lastMessage.sentByCurrentUser
//                         ? "bg-blue-50"
//                         : ""
//                     }`}
//                     onClick={() => handleConversationSelect(conv.id)}
//                   >
//                     <div className="p-3 hover:bg-gray-50">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">
//                             {conv.listingTitle}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {conv.otherUser.name}
//                           </p>
//                           <p
//                             className={`text-sm mt-1 truncate ${
//                               !conv.lastMessage.isRead &&
//                               !conv.lastMessage.sentByCurrentUser
//                                 ? "font-medium"
//                                 : "text-gray-600"
//                             }`}
//                           >
//                             {conv.lastMessage.sentByCurrentUser && "You: "}
//                             {conv.lastMessage.text}
//                           </p>
//                         </div>

//                         <div className="flex flex-col items-end ml-2">
//                           <span className="text-xs text-gray-500">
//                             {formatMessageTime(conv.lastMessage.timestamp)}
//                           </span>
//                           {conv.unreadCount > 0 && (
//                             <span className="mt-1 -pt-2  text-[10px] font-bold bg-[#bf072c] text-white rounded-full h-5 w-5 flex items-center justify-center ">
//                               {conv.unreadCount}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Chat View (shown when a conversation is active) */}
//       {activeConversation && activeConversationData && (
//         <ChatConversation
//           conversationId={activeConversationData.id}
//           otherUserName={activeConversationData.otherUser.name}
//           listingTitle={activeConversationData.listingTitle}
//           listingId={activeConversationData.listingId}
//           messages={activeConversationData.messages}
//           onSendMessage={handleSendMessage}
//           onBack={handleBack}
//         />
//       )}
//     </div>
//   );
// };

// export default Messages;

import React, { useState, useEffect } from 'react';
import { useMessages } from '@/context/MessageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTime } from '@/lib/utils';

const Messages = () => {
  const { conversations, setActiveConversation, unreadMessages } = useMessages();
  const { user } = useAuth();
  const navigate = useNavigate();

  // console.log('conversations', conversations);
  // console.log(unreadMessages)

  // // Format time in a brief, readable format
  // const formatMessageTime = (date: Date) => {
  //   return formatDistanceToNow(date, { addSuffix: true });
  // };




  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversations.find(conv => conv.id === conversationId) || null);
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="min-h-[85vh] flex flex-col bg-white">
      {/* Conversations List */}
      <div className="w-full h-full flex flex-col mb-8">
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4 text-gray-500">
              No messages yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <li key={conv.id} className="cursor-pointer" onClick={() => handleConversationSelect(conv.id)}>
                  {/* <div className={`p-3 hover:bg-gray-50 ${unreadMessages?.[conv?.id] > 0 && 'bg-blue-200 hover:bg-blue-100'}`}> */}
                  <div className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{conv.listing.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{conv?.other?.name}</p>
                        {/* <p className={`text-sm mt-1 truncate ${!conv.message?.read ? 'font-medium' : 'text-gray-600'}`}>
                          {conv.lastMessage?.senderId ? "You: " : ""}{conv.lastMessage?.content}
                        </p> */}
                        {/* {!conv.lastMessage && (
                          <span className="text-sm">
                            No messages yet
                          </span>
                        )} */}
                        {
                          conv?.messages?.length > 0 ? (
                            <span className={`text-xs ${(conv.messages[conv.messages.length - 1]?.isRead || conv.messages[conv.messages.length - 1]?.senderId == user.id) ? 'text-gray-' : 'text-black font-bold'}`}>
                              {conv.messages[conv.messages.length - 1]?.senderId == user?.id ? "You: " : ""}{conv.messages[conv.messages.length - 1]?.content}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">
                              No messages yet
                            </span>
                          )
                        }
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        {
                          conv?.messages?.length > 0 ? (
                            <span className="text-xs text-gray-500 flex justify-center items-center">{formatTime(new Date(conv?.messages?.[conv?.messages?.length - 1]?.timestamp).toString())}</span>
                          ) : (
                            // <span className="text-xs text-gray-500">
                            // </span>
                            ''
                          )
                        }

                        {unreadMessages?.[conv?.id] > 0 && (
                          <span className="mt-1 text-[10px] font-bold bg-[#bf072c] text-white rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadMessages[conv.id] < 10 ? unreadMessages[conv.id] : '9+'}
                            
                          </span>
                        )}

                        {/* {conv.unreadCount > 0 && (
                          <span className="mt-1 pt-2 text-[10px] font-bold bg-[#bf072c] text-white rounded-full h-5 w-5 flex items-center justify-center ">
                            {conv.unreadCount}
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
