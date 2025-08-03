// // src/context/MessageContext.tsx
// import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
// import { Conversation, Message } from '@/types/chat'; // define types if not already
// import { useSocket } from './SocketContext';
// import { useAuth } from './AuthContext';
// import { api } from '@/lib/axois';

// type MessageContextType = {
//   conversations: Conversation[];
//   activeConversation: Conversation | null;
//   setConversations: (convs: Conversation[]) => void;
//   setActiveConversation: (conv: Conversation | null) => void;
//   addMessage: (conversationId: string, message: Message) => void;
// };

// const MessageContext = createContext<MessageContextType | undefined>(undefined);

// export const useMessages = () => {
//   const ctx = useContext(MessageContext);
//   if (!ctx) throw new Error('useMessages must be used within MessageProvider');
//   return ctx;
// };

// export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
//   const { socket } = useSocket();
//   const { user } = useAuth();

//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);


//   const addMessage = (conversationId: string, message: Message) => {
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? {
//               ...conv,
//               messages: [...conv.messages, message],
//               lastMessage: message,
//             }
//           : conv
//       )
//     );

//     if (activeConversation?.id === conversationId) {
//       setActiveConversation((prev) =>
//         prev ? { ...prev, messages: [...prev.messages, message] } : null
//       );
//     }
//   };

//   const handleIncomingMessage = ({ from, data }: any) => {
//     const newMessage: Message = {
//       id: data.id,
//       senderId: from,
//       content: data.content,
//       timestamp: new Date(data.timestamp),
//       read: false,
//     };
//     addMessage(data.conversationId, newMessage);
//   };



//   const handleConversationCreated = ({ data }: any) => {
//     console.log("socket conversation => ", data)
//     setConversations((prev) => {
//       const exists = prev.find((c) => c.id === data.id);
//       if (exists) return prev;
//       return [data, ...prev];
//     });
//   };

//   const handleMessageRead = ({ conversationId, messageId }: any) => {
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? {
//               ...conv,
//               messages: conv.messages.map((msg) =>
//                 msg.id === messageId ? { ...msg, read: true } : msg
//               ),
//             }
//           : conv
//       )
//     );
//   };


// const getExistingConversations = useCallback(async () => {
//   try {
//     const response = await api.get("/chat/conversation");
//     const conversations = response.data.data.map((conv: any) => ({
//       id: conv.id,
//       creator: conv.creator,
//       participant: conv.participant,
//       listing: conv.listing,
//       messages: conv.messages || [],
//       unreadCount: conv.unread_count,
//       createdAt: new Date(conv.created_at),
//       updatedAt: new Date(conv.updated_at),
//       lastMessage: conv.messages?.[conv.messages.length - 1] || null
//     }));
//     setConversations(conversations);
//   } catch (error) {
//     console.error("Failed to fetch conversations:", error);
//   }
// }, []);

//   useEffect(() => {
//     if (!socket || !user?.id) return;

//     getExistingConversations()

//     socket.on('message', handleIncomingMessage);
//     socket.on('conversation', handleConversationCreated);
//     socket.on('message_read', handleMessageRead);

//     return () => {
//       socket.off('message', handleIncomingMessage);
//       socket.off('conversation', handleConversationCreated);
//       socket.off('message_read', handleMessageRead);
//     };
//   }, [socket, user?.id]);



//   return (
//     <MessageContext.Provider
//       value={{
//         conversations,
//         activeConversation,
//         setConversations,
//         setActiveConversation,
//         addMessage,
//       }}
//     >
//       {children}
//     </MessageContext.Provider>
//   );
// };


// import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// // import { Conversation, Message } from '@/types/chat'; // Define types if not already
// import { useSocket } from './SocketContext';
// import { useAuth } from './AuthContext';
// import { api } from '@/lib/axois';

// type MessageContextType = {
//   conversations: any[];
//   activeConversation: any | null;
//   setConversations: (convs: any[]) => void;
//   setActiveConversation: (conv: any | null) => void;
//   addMessage: (conversationId: string, message: any) => void;
// };

// const MessageContext = createContext<MessageContextType | undefined>(undefined);

// export const useMessages = () => {
//   const ctx = useContext(MessageContext);
//   if (!ctx) throw new Error('useMessages must be used within MessageProvider');
//   return ctx;
// };

// export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
//   const { socket } = useSocket();
//   const { user } = useAuth();

//   const [conversations, setConversations] = useState<any[]>([]);
//   const [activeConversation, setActiveConversation] = useState<any | null>(null);

//   // Add a new message to the conversation
//   const addMessage = (conversationId: string, message: any) => {
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? {
//               ...conv,
//               messages: [...conv.messages, message],
//               lastMessage: message,
//             }
//           : conv
//       )
//     );

//     if (activeConversation?.id === conversationId) {
//       setActiveConversation((prev) =>
//         prev ? { ...prev, messages: [...prev.messages, message] } : null
//       );
//     }
//   };

//   const handleIncomingMessage = ({ from, data }: any) => {
//     console.log("socket message => ", data)
//     const newMessage: any = {
//       id: data.id,
//       senderId: from,
//       content: data.content,
//       timestamp: new Date(data.timestamp),
//       read: false,
//     };
//     addMessage(data.conversationId, newMessage);
//   };

//   // Handle the creation of new conversations
//   const handleConversationCreated = ({ data }: any) => {
//     setConversations((prev) => {
//       const exists = prev.find((c) => c.id === data.id);
//       if (exists) return prev;

//       // take creator and participant check which is not current user and add other: name
//       if (data.creator.id !== user?.id) {
//           data.other = data.creator;
//       } else if(data.participant.id !== user?.id) {
//           data.other = data.participant;
//       }
//       return [data, ...prev];
//     });
//   };

//   // Handle when a message is read
//   const handleMessageRead = ({ conversationId, messageId }: any) => {
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? {
//               ...conv,
//               messages: conv.messages.map((msg) =>
//                 msg.id === messageId ? { ...msg, read: true } : msg
//               ),
//             }
//           : conv
//       )
//     );
//   };

//   // Fetch existing conversations on mount
//   const getExistingConversations = useCallback(async () => {
//     try {
//       const { data } = await api.get("/chat/conversation");
//     //   const conversations = response.data.data.map((conv: any) => ({
//     //     id: conv.id,
//     //     creator: conv.creator,
//     //     participant: conv.participant,
//     //     listing: conv.listing,
//     //     messages: conv.messages || [],
//     //     unreadCount: conv.unread_count,
//     //     createdAt: new Date(conv.created_at),
//     //     updatedAt: new Date(conv.updated_at),
//     //     lastMessage: conv.messages?.[conv.messages.length - 1] || null,
//     //   }));

//         const conversations = data?.data

//         // take creator and participant check which is not current user and add other: name
//         conversations.forEach((conv: any) => {

//             if (conv.creator.id !== user?.id) {
//                 conv.other = conv.creator;
//             } else if (conv.participant.id!== user?.id) {
//                 conv.other = conv.participant;
//             }
//             console.log("user => ", user?.id)
//             console.log("conv => ", conv)
//         });

//       setConversations(conversations);
//     } catch (error) {
//       console.error("Failed to fetch conversations:", error);
//     }
//   }, []);

//   // Effect to subscribe to socket events
//   useEffect(() => {
//     if (!socket || !user?.id) return;

//     console.log("socket => ", socket)
//     console.log("user => ", user?.id)

//     getExistingConversations();

//     socket.on('message', handleIncomingMessage);
//     socket.on('conversation', handleConversationCreated);
//     socket.on('message_read', handleMessageRead);

//     return () => {
//       socket.off('message', handleIncomingMessage);
//       socket.off('conversation', handleConversationCreated);
//       socket.off('message_read', handleMessageRead);
//     };
//   }, [socket, user?.id, getExistingConversations]);

//   return (
//     <MessageContext.Provider
//       value={{
//         conversations,
//         activeConversation,
//         setConversations,
//         setActiveConversation,
//         addMessage,
//       }}
//     >
//       {children}
//     </MessageContext.Provider>
//   );
// };


// import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import { useSocket } from './SocketContext';
// import { useAuth } from './AuthContext';
// import { api } from '@/lib/axois';
// import { Message } from '@/types/chat';

// type MessageContextType = {
//   conversations: any[];
//   activeConversation: any | null;
//   unreadMessages: UnReadMessages;
//   setConversations: (convs: any[]) => void;
//   setActiveConversation: (conv: any | null) => void;
//   addMessage: (conversationId: string, message: any) => void;
// };

// const MessageContext = createContext<MessageContextType | undefined>(undefined);

// export const useMessages = () => {
//   const ctx = useContext(MessageContext);
//   if (!ctx) throw new Error('useMessages must be used within MessageProvider');
//   return ctx;
// };

// type UnReadMessages = Record<string, number>;


// export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
//   const { socket } = useSocket();
//   const { user } = useAuth(); // Using the existing AuthContext for user

//   const [conversations, setConversations] = useState<any[]>([]);
//   const [activeConversation, setActiveConversation] = useState<any | null>(null);
//   const [unreadMessages, setUnreadMessages] = useState<UnReadMessages>({});
//   // console.log("active conversation => ", activeConversation)

//   // const addMessage = (conversationId: string, message: any) => {
//   //   setConversations((prev) =>
//   //     prev.map((conv) =>
//   //       conv.id === conversationId
//   //         ? {
//   //             ...conv,
//   //             messages: [...conv.messages, message],
//   //             lastMessage: message,
//   //           }
//   //         : conv
//   //     )
//   //   );

//   //   if (activeConversation?.id === conversationId) {
//   //     setActiveConversation((prev) =>
//   //       prev ? { ...prev, messages: [...prev.messages, message] } : null
//   //     );
//   //   }
//   // };

//   // const addMessage = (conversationId: string, message: Message) => {
//   //   setConversations((prev) =>
//   //     prev.map((conv) => {
//   //       if (conv.id === conversationId) {
//   //         const updatedMessages = conv.messages ? [...conv.messages, message] : [message];
//   //         return {
//   //           ...conv,
//   //           messages: updatedMessages,
//   //           lastMessage: message,
//   //         };
//   //       }
//   //       return conv;
//   //     })
//   //   );

//   //   if (activeConversation?.id === conversationId) {
//   //     setActiveConversation((prev) =>
//   //       prev
//   //         ? {
//   //             ...prev,
//   //             messages: prev.messages ? [...prev.messages, message] : [message],
//   //           }
//   //         : null
//   //     );
//   //   }
//   // };

//   const addMessage = (conversationId: string, message: Message) => {
//     setConversations((prev) => {
//       // Find the conversation that matches the conversationId
//       const targetConversation = prev.find(conv => conv.id === conversationId);
//       if (!targetConversation) return prev;

//       // Remove the target conversation from the array
//       const otherConversations = prev.filter(conv => conv.id !== conversationId);

//       // Create updated conversation with new message
//       const updatedConversation = {
//         ...targetConversation,
//         messages: targetConversation.messages ? [...targetConversation.messages, message] : [message],
//         lastMessage: message,
//       };

//       // Return array with updated conversation at the beginning
//       return [updatedConversation, ...otherConversations];
//     });

//     console.log("active conversation => ", activeConversation?.id, conversationId, activeConversation?.id === conversationId)
//     if (activeConversation?.id === conversationId) {
//       setActiveConversation((prev) =>
//         prev
//           ? {
//             ...prev,
//             messages: prev.messages ? [...prev.messages, message] : [message],
//           }
//           : null
//       );
//     } else {
//       setUnreadMessages((prev) => ({
//         ...prev,
//         [conversationId]: (prev[conversationId] || 0) + 1,
//       }));

//     }
//   };


//   const handleIncomingMessage = async ({ from, data }: any) => {
//     console.log("socket message => ", data)
//     data = data?.message

//     const newMessage: any = {
//       id: data.id,
//       senderId: from,
//       content: data.body_text,
//       receiver_id: data.receiver_id,
//       timestamp: new Date(data.created_at),
//       isRead: data.conversation_id === activeConversation?.id,
//     };
//     // console.log("newMessage => ", newMessage)
//     addMessage(data.conversation_id, newMessage);
//   };

//   const handleConversationCreated = ({ data }: any) => {
//     setConversations((prev) => {
//       const exists = prev.find((c) => c.id === data.id);
//       if (exists) return prev;

//       // Handle creator and participant
//       if (data.creator.id !== user?.id) {
//         data.other = data.creator;
//       } else if (data.participant.id !== user?.id) {
//         data.other = data.participant;
//       }

//       return [data, ...prev];
//     });
//   };

//   const handleMessageRead = ({ conversationId, messageId }: any) => {
//     setConversations((prev) =>
//       prev.map((conv) =>
//         conv.id === conversationId
//           ? {
//             ...conv,
//             messages: conv.messages.map((msg) =>
//               msg.id === messageId ? { ...msg, isRead: true } : msg
//             ),
//           }
//           : conv
//       )
//     );
//   };

//   const getExistingConversations = useCallback(async () => {
//     // Check if user is defined before making the API call
//     if (!user?.id) return; // If user is undefined, do nothing

//     try {
//       const { data } = await api.get("/chat/conversation");

//       // Process the conversations
//       const conversations = data?.data || [];
//       const unreadMap: UnReadMessages = {};

//       // Update each conversation with the `other` user
//       conversations.forEach((conv: any) => {
//         if (conv.creator.id !== user?.id) {
//           conv.other = conv.creator;
//         } else if (conv.participant.id !== user?.id) {
//           conv.other = conv.participant;
//         }

//         // format messages
//         conv.messages.forEach((msg: any) => {
//           msg['id'] = msg.id;
//           msg['senderId'] = msg.sender_id;
//           msg['receiverId'] = msg.receiver_id;
//           msg['content'] = msg.message;
//           msg['timestamp'] = new Date(msg.created_at);
//           msg['isRead'] = msg.is_read;
//         });

//         const unreadCount = conv.messages.filter(
//           (msg: any) => !msg.isRead && msg.receiverId === user?.id
//         ).length;

//         if (unreadCount > 0) {
//           unreadMap[conv.id] = unreadCount;
//         }

//       });

//       // console.log("unread messages => ", unreadMap)

//       setUnreadMessages(unreadMap);


//       // format the messages
//       // conversations.forEach((conv: any) => {

//       //   conv.messages.forEach((msg: any) => {
//       //     msg['id'] = msg.id;
//       //     msg['senderId'] = msg.sender_id;
//       //     msg['receiverId'] = msg.receiver_id;
//       //     msg['content'] = msg.message;
//       //     msg['timestamp'] = new Date(msg.created_at);
//       //     msg['isRead'] = msg.is_read;
//       //   });
//       // });

//       // console.log("conversations => ", conversations)
//       setConversations(conversations);
//     } catch (error) {
//       console.error("Failed to fetch conversations:", error);
//     }
//   }, [user?.id]); // Re-fetch if user changes


//   const fetchConversationData = useCallback(async () => {
//     try {
//       const { data } = await api.patch(
//         `chat/conversation/${activeConversation.id}/read`
//       ); // Adjust based on how your API works

//       if (data.success) {
//         // Make unread message count 0
//         setUnreadMessages((prev) => {
//           if (!prev) return {};
//           const { [activeConversation.id]: _, ...rest } = prev;
//           return rest;
//         });

//         // Check if activeConversation messages need updating
//         setActiveConversation((prev) =>
//           prev && prev.id === activeConversation.id
//             ? {
//               ...prev,
//               messages: prev.messages
//                 ? prev.messages.map((msg: any) => ({
//                   ...msg,
//                   isRead: true,
//                 }))
//                 : [],
//             }
//             : prev
//         );

//         setConversations((prev) =>
//           prev.map((conv) =>
//             conv.id === activeConversation.id
//              ? {
//                ...conv,
//                 messages: conv.messages
//                  ? conv.messages.map((msg: any) => ({
//                    ...msg,
//                     isRead: true,
//                   }))
//                   : [],
//               }
//               : conv
//           )
//         );

//         setUnreadMessages((prev) => {
//           const { [activeConversation.id]: _, ...rest } = prev;
//           return rest;
//         });

//       }
//     } catch (error) {
//       console.error('Error fetching conversation data:', error);
//     }
//   }, [activeConversation?.id])

//   useEffect(() => {
//     if (activeConversation !== null) {
//       fetchConversationData(); // Call the function to make the request
//     }
//   }, [activeConversation?.id]); // Dependency array ensures it only runs when activeConversation changes


//   // Effect to subscribe to socket events
//   useEffect(() => {
//     if (!socket || !user?.id) return; // Only run when user is defined and socket is available

//     getExistingConversations();

//     // console.log("converstations => ", conversations)

//     socket.on('message', handleIncomingMessage);
//     socket.on('conversation', handleConversationCreated);
//     // socket.on('message_read', handleMessageRead);

//     return () => {
//       socket.off('message', handleIncomingMessage);
//       socket.off('conversation', handleConversationCreated);
//       // socket.off('message_read', handleMessageRead);
//     };
//   }, [socket, user?.id, getExistingConversations]);




//   return (
//     <MessageContext.Provider
//       value={{
//         conversations,
//         activeConversation,
//         unreadMessages,
//         setConversations,
//         setActiveConversation,
//         addMessage,
//       }}
//     >
//       {children}
//     </MessageContext.Provider>
//   );
// };



// import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import { useSocket } from './SocketContext';
// import { useAuth } from './AuthContext';
// import { api } from '@/lib/axois';
// import { Message } from '@/types/chat';

// type MessageContextType = {
//   conversations: any[];
//   activeConversation: any | null;
//   unreadMessages: UnReadMessages;
//   setConversations: (convs: any[]) => void;
//   setActiveConversation: (conv: any | null) => void;
//   addMessage: (conversationId: string, message: Message) => void;
//   markMessagesAsRead: (conversationId: string) => void;
//   getUnreadCount: (conversationId: string) => number;
//   handleSetUnreadMessages: (conversationId: string, count: number) => void;
// };

// const MessageContext = createContext<MessageContextType | undefined>(undefined);

// export const useMessages = () => {
//   const ctx = useContext(MessageContext);
//   if (!ctx) throw new Error('useMessages must be used within MessageProvider');
//   return ctx;
// };

// type UnReadMessages = Record<string, number>;

// export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
//   const { socket } = useSocket();
//   const { user } = useAuth();

//   const [conversations, setConversations] = useState<any[]>([]);
//   const [activeConversation, setActiveConversation] = useState<any | null>(null);
//   const [unreadMessages, setUnreadMessages] = useState<UnReadMessages>({});

//   const getUnreadCount = useCallback((conversationId: string) => {
//     return unreadMessages[conversationId] || 0;
//   }, [unreadMessages]);

//   const handleSetUnreadMessages = useCallback((conversationId: string, count: number) => {
//     setUnreadMessages((prev) => ({
//     ...prev,
//       [conversationId]: count,
//     }));
//   }, []);

//   const addMessage = useCallback(async (conversationId: string, message: Message) => {
//     setConversations((prev) => {
//       const targetConversation = prev.find(conv => conv.id === conversationId);
//       if (!targetConversation) return prev;

//       const otherConversations = prev.filter(conv => conv.id !== conversationId);
//       const updatedConversation = {
//         ...targetConversation,
//         messages: targetConversation.messages ? [...targetConversation.messages, message] : [message],
//         lastMessage: message,
//       };

//       return [updatedConversation, ...otherConversations];
//     });

//     if (activeConversation?.id === conversationId) {
//       setActiveConversation((prev) =>
//         prev
//           ? {
//             ...prev,
//             messages: prev.messages ? [...prev.messages, message] : [message],
//           }
//           : null
//       );
//       await api.patch(`chat/conversation/${activeConversation.id}/read`);
//     } else  {
//       setUnreadMessages((prev) => ({
//         ...prev,
//         [conversationId]: (prev[conversationId] || 0) + 1,
//       }));
//     }
//   }, [activeConversation?.id, user?.id]);

//   const markMessagesAsRead = useCallback((conversationId: string) => {
//     setConversations(prev => 
//       prev.map(conv => 
//         conv.id === conversationId
//           ? {
//               ...conv,
//               messages: conv.messages.map(msg => 
//                 msg.receiver_id === user?.id 
//                   ? { ...msg, isRead: true } 
//                   : msg
//               )
//             }
//           : conv
//       )
//     );

//     setUnreadMessages(prev => {
//       const { [conversationId]: _, ...rest } = prev;
//       return rest;
//     });
//   }, [user?.id]);

//   const handleIncomingMessage = useCallback(({ from, data }: any) => {
//     data = data?.message;

//     const newMessage: Message = {
//       id: data.id,
//       senderId: from,
//       content: data.body_text,
//       receiver_id: data.receiver_id,
//       timestamp: new Date(data.created_at),
//       isRead: data.conversation_id === activeConversation?.id,
//     };
//     addMessage(data.conversation_id, newMessage);
//   }, [activeConversation?.id, addMessage]);

//   const handleConversationCreated = useCallback(({ data }: any) => {
//     setConversations((prev) => {
//       const exists = prev.find((c) => c.id === data.id);
//       if (exists) return prev;

//       if (data.creator.id !== user?.id) {
//         data.other = data.creator;
//       } else if (data.participant.id !== user?.id) {
//         data.other = data.participant;
//       }

//       return [data, ...prev];
//     });
//   }, [user?.id]);

//   const getExistingConversations = useCallback(async () => {
//     if (!user?.id) return;

//     try {
//       const { data } = await api.get("/chat/conversation");
//       const conversations = data?.data || [];
//       const unreadMap: UnReadMessages = {};

//       conversations.forEach((conv: any) => {
//         if (conv.creator.id !== user?.id) {
//           conv.other = conv.creator;
//         } else if (conv.participant.id !== user?.id) {
//           conv.other = conv.participant;
//         }

//         conv.messages.forEach((msg: any) => {
//           msg.id = msg.id;
//           msg.senderId = msg.sender_id;
//           msg.receiverId = msg.receiver_id;
//           msg.content = msg.message;
//           msg.timestamp = new Date(msg.created_at);
//           msg.isRead = msg.is_read;
//         });

//         const unreadCount = conv.messages.filter(
//           (msg: any) => !msg.isRead && msg.receiverId === user?.id
//         ).length;

//         if (unreadCount > 0) {
//           unreadMap[conv.id] = unreadCount;
//         }
//       });

//       setUnreadMessages(unreadMap);
//       setConversations(conversations);
//     } catch (error) {
//       console.error("Failed to fetch conversations:", error);
//     }
//   }, [user?.id]);

//   const fetchConversationData = useCallback(async () => {
//     if (!activeConversation?.id) return;

//     try {
//       await api.patch(`chat/conversation/${activeConversation.id}/read`);
//       markMessagesAsRead(activeConversation.id);
//     } catch (error) {
//       console.error('Error fetching conversation data:', error);
//     }
//   }, [activeConversation?.id, markMessagesAsRead]);

//   useEffect(() => {
//     if (activeConversation) {
//       fetchConversationData();
//     }
//   }, [activeConversation?.id, fetchConversationData]);

//   useEffect(() => {
//     if (!socket || !user?.id) return;

//     getExistingConversations();

//     socket.on('message', handleIncomingMessage);
//     socket.on('conversation', handleConversationCreated);

//     socket.on('conversation-blocked', ({ conversation_id, by }) => {
//       // Disable sending messages in the UI for that conversation
//     });

//     socket.on('conversation-unblocked', ({ conversation_id, by }) => {
//       // Re-enable messaging
//     });

//     socket.on('conversation-soft-deleted', ({ conversation_id }) => {
//       // Hide that conversation from the UI
//     });

//     socket.on('delete-conversation', ({ conversation_id }) => {
//       // Remove completely if admin-deleted
//     });


//     return () => {
//       socket.off('message', handleIncomingMessage);
//       socket.off('conversation', handleConversationCreated);
//     };
//   }, [socket, user?.id, getExistingConversations, handleIncomingMessage, handleConversationCreated]);

//   return (
//     <MessageContext.Provider
//       value={{
//         conversations,
//         activeConversation,
//         unreadMessages,
//         setConversations,
//         setActiveConversation,
//         addMessage,
//         markMessagesAsRead,
//         getUnreadCount,
//         handleSetUnreadMessages,
//       }}
//     >
//       {children}
//     </MessageContext.Provider>
//   );
// };



import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { api } from '@/lib/axois';
import { Message } from '@/types/chat';
import utcToLocalDate from '@/utils/utcToLocalDate';

type UnReadMessages = Record<string, number>;

type MessageContextType = {
  conversations: any[];
  activeConversation: any | null;
  unreadMessages: UnReadMessages;
  setConversations: (convs: any[]) => void;
  setActiveConversation: (conv: any | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  markMessagesAsRead: (conversationId: string) => void;
  getUnreadCount: (conversationId: string) => number;
  handleSetUnreadMessages: (conversationId: string, count: number) => void;
  handleConversationCreated: (data: any) => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error('useMessages must be used within MessageProvider');
  return ctx;
};

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<UnReadMessages>({});

  const getUnreadCount = useCallback((conversationId: string) => unreadMessages[conversationId] || 0, [unreadMessages]);

  const handleSetUnreadMessages = useCallback((conversationId: string, count: number) => {
    setUnreadMessages(prev => ({ ...prev, [conversationId]: count }));
  }, []);

  const addMessage = useCallback(async (conversationId: string, message: Message) => {
    // console.log("message inside context: ", message)
    setConversations(prev => {
      const target = prev.find(c => c.id === conversationId);
      if (!target) return prev;

      const others = prev.filter(c => c.id !== conversationId);
      const updated = {
        ...target,
        messages: [...(target.messages || []), message],
        lastMessage: message,
      };

      return [updated, ...others];
    });

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: [...(prev.messages || []), message],
      } : null);
      await api.patch(`chat/conversation/${conversationId}/read`);
    } else {
      setUnreadMessages(prev => ({ ...prev, [conversationId]: (prev[conversationId] || 0) + 1 }));
    }
  }, [activeConversation?.id]);

  const markMessagesAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => conv.id === conversationId
      ? {
        ...conv,
        messages: conv.messages.map(msg =>
          msg.receiver_id === user?.id ? { ...msg, isRead: true } : msg
        ),
      }
      : conv
    ));

    setUnreadMessages(prev => {
      const { [conversationId]: _, ...rest } = prev;
      return rest;
    });
  }, [user?.id]);

  const handleIncomingMessage = useCallback(({ from, data }: any) => {
    data = data?.message;
    const newMessage: Message = {
      id: data.id,
      senderId: from,
      content: data.body_text,
      receiver_id: data.receiver_id,
      timestamp: utcToLocalDate(data.created_at) || new Date(),
      created_at: data.created_at,
      isRead: data.conversation_id === activeConversation?.id,
    };
    addMessage(data.conversation_id, newMessage);
  }, [addMessage, activeConversation?.id]);

  // const handleConversationCreated = useCallback(({ data }: any) => {
  //   setConversations(prev => {
  //     const exists = prev.find(c => c.id === data.id);
  //     if (exists) return prev;

  //     data.other = data.creator.id !== user?.id ? data.creator : data.participant;
  //     return [data, ...prev];
  //   });
  // }, [user?.id]);

  const handleConversationCreated = ({ data }: any) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === data.id);
  
      if (exists) {
        // Case: previously soft-deleted by current user
        // return prev.map((c) =>
        //   c.id === data.id ? { ...c, ...data } : c
        // );
        return prev;
      }

      const isCreator = data.creator.id === user?.id;
      const other = isCreator ? data.participant : data.creator;
      data.other = other;

      data.messages.forEach((msg: any) => {
        msg.id = msg.id;
        msg.senderId = msg.sender_id;
        msg.receiverId = msg.receiver_id;
        msg.content = msg.message;
        msg.timestamp = new Date(msg.created_at);
        msg.isRead = msg.is_read;
      });

      // const readMessages = data.messages.filter((msg: any) => !msg.isRead && msg.receiverId === user?.id).length;
      
      // Compute block states
      const blockedByMe = isCreator ? data.blocked_by_creator : data.blocked_by_participant;
      const blockedByOther = isCreator ? data.blocked_by_participant : data.blocked_by_creator;
      const isBlocked = blockedByMe || blockedByOther;

      // Add fields
      data.blockedByMe = blockedByMe;
      data.blockedByOther = blockedByOther;
      data.isBlocked = isBlocked;

      
  
      // Add .other field for UI
      if (data.creator.id !== user?.id) {
        data.other = data.creator;
      } else if (data.participant.id !== user?.id) {
        data.other = data.participant;
      }
  
      return [data, ...prev];
    });
  };
  


  const getExistingConversations = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data } = await api.get("/chat/conversation");
      const convs = data?.data || [];
      const unreadMap: UnReadMessages = {};

      convs.forEach((conv: any) => {
        // conv.other = conv.creator.id !== user?.id ? conv.creator : conv.participant;
        const isCreator = conv.creator.id === user?.id;
        const other = isCreator ? conv.participant : conv.creator;
        conv.other = other;

        conv.messages.forEach((msg: any) => {
          msg.id = msg.id;
          msg.senderId = msg.sender_id;
          msg.receiverId = msg.receiver_id;
          msg.content = msg.message;
          msg.timestamp = new Date(msg.created_at);
          msg.isRead = msg.is_read;
        });
        const unread = conv.messages.filter((msg: any) => !msg.isRead && msg.receiverId === user?.id).length;
        if (unread > 0) unreadMap[conv.id] = unread;

        // Compute block states
        const blockedByMe = isCreator ? conv.blocked_by_creator : conv.blocked_by_participant;
        const blockedByOther = isCreator ? conv.blocked_by_participant : conv.blocked_by_creator;
        const isBlocked = blockedByMe || blockedByOther;

        // Add fields
        conv.blockedByMe = blockedByMe;
        conv.blockedByOther = blockedByOther;
        conv.isBlocked = isBlocked;

      });

      setUnreadMessages(unreadMap);
      setConversations(convs);
    } catch (err) {
      // console.error("Failed to fetch conversations:", err);
    }
  }, [user?.id]);

  const fetchConversationData = useCallback(async () => {
    if (!activeConversation?.id) return;
    try {
      await api.patch(`chat/conversation/${activeConversation.id}/read`);
      markMessagesAsRead(activeConversation.id);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [activeConversation?.id, markMessagesAsRead]);

  useEffect(() => {
    if (activeConversation) fetchConversationData();
  }, [activeConversation?.id, fetchConversationData]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    // getExistingConversations();

    socket.on('message', handleIncomingMessage);
    socket.on('conversation', handleConversationCreated);
    socket.on('deleted-conversation', ({ from, data }) => {
      // console.log("deleted conversation: ", data)
      const isCreator = data.creator.id === user?.id;
        const other = isCreator ? data.participant : data.creator;
        data.other = other;

        data.messages.forEach((msg: any) => {
          msg.id = msg.id;
          msg.senderId = msg.sender_id;
          msg.receiverId = msg.receiver_id;
          msg.content = msg.message;
          msg.timestamp = new Date(msg.created_at);
          msg.isRead = msg.is_read;
        });
        const unread = data.messages.filter((msg: any) => !msg.isRead && msg.receiverId === user?.id).length;
        // if (unread > 0) unreadMap[data.id] = unread;

        // Compute block states
        const blockedByMe = isCreator ? data.blocked_by_creator : data.blocked_by_participant;
        const blockedByOther = isCreator ? data.blocked_by_participant : data.blocked_by_creator;
        const isBlocked = blockedByMe || blockedByOther;

        // Add fields
        data.blockedByMe = blockedByMe;
        data.blockedByOther = blockedByOther;
        data.isBlocked = isBlocked;

        setConversations(prev => {
          const exists = prev?.find(c => c.id === data.id);
          if (exists) return prev;
          return [data,...prev];
        });
    })

    socket.on('conversation-blocked', ({ conversation_id, by }) => {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id !== conversation_id) return conv;

          const isCreator = conv.creator.id === user?.id;

          const blockedByMe = by === user?.id;
          const blockedByOther = !blockedByMe;

          return {
            ...conv,
            blockedByMe,
            blockedByOther,
            isBlocked: true,
          };
        })
      );
    });

    socket.on('conversation-unblocked', ({ conversation_id, by }) => {
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id !== conversation_id) return conv;

          const isCreator = conv.creator.id === user?.id;

          const blockedByMe = false;
          const blockedByOther = false;

          return {
            ...conv,
            blockedByMe,
            blockedByOther,
            isBlocked: false,
          };
        })
      );
    });


    socket.on('conversation-soft-deleted', ({ conversation_id }) => {
      setConversations(prev => prev.filter(conv => conv.id !== conversation_id));
    });

    socket.on('delete-conversation', ({ conversation_id }) => {
      setConversations(prev => prev.filter(conv => conv.id !== conversation_id));
    });

    return () => {
      socket.off('message', handleIncomingMessage);
      socket.off('conversation', handleConversationCreated);
      socket.off('conversation-blocked');
      socket.off('conversation-unblocked');
      socket.off('conversation-soft-deleted');
      socket.off('delete-conversation');
    };
  }, [socket, user?.id, handleIncomingMessage, handleConversationCreated]);

  useEffect(() => {
    if (!user?.id) return;
    getExistingConversations();
  }, [user?.id, getExistingConversations])

  return (
    <MessageContext.Provider
      value={{
        conversations,
        activeConversation,
        unreadMessages,
        setConversations,
        setActiveConversation,
        addMessage,
        markMessagesAsRead,
        getUnreadCount,
        handleSetUnreadMessages,
        handleConversationCreated,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
