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


import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import { Conversation, Message } from '@/types/chat'; // Define types if not already
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { api } from '@/lib/axois';

type MessageContextType = {
  conversations: any[];
  activeConversation: any | null;
  setConversations: (convs: any[]) => void;
  setActiveConversation: (conv: any | null) => void;
  addMessage: (conversationId: string, message: any) => void;
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

  // Add a new message to the conversation
  const addMessage = (conversationId: string, message: any) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message,
            }
          : conv
      )
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, message] } : null
      );
    }
  };

  const handleIncomingMessage = ({ from, data }: any) => {
    const newMessage: any = {
      id: data.id,
      senderId: from,
      content: data.content,
      timestamp: new Date(data.timestamp),
      read: false,
    };
    addMessage(data.conversationId, newMessage);
  };

  // Handle the creation of new conversations
  const handleConversationCreated = ({ data }: any) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === data.id);
      if (exists) return prev;
      return [data, ...prev];
    });
  };

  // Handle when a message is read
  const handleMessageRead = ({ conversationId, messageId }: any) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, read: true } : msg
              ),
            }
          : conv
      )
    );
  };

  // Fetch existing conversations on mount
  const getExistingConversations = useCallback(async () => {
    try {
      const { data } = await api.get("/chat/conversation");
    //   const conversations = response.data.data.map((conv: any) => ({
    //     id: conv.id,
    //     creator: conv.creator,
    //     participant: conv.participant,
    //     listing: conv.listing,
    //     messages: conv.messages || [],
    //     unreadCount: conv.unread_count,
    //     createdAt: new Date(conv.created_at),
    //     updatedAt: new Date(conv.updated_at),
    //     lastMessage: conv.messages?.[conv.messages.length - 1] || null,
    //   }));

        const conversations = data?.data

        // take creator and participant check which is not current user and add other: name
        conversations.forEach((conv: any) => {
            if (conv.creator.id !== user?.id) {
                conv.other = conv.creator;
            } else {
                conv.other = conv.participant;
            }
        });

      setConversations(conversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  // Effect to subscribe to socket events
  useEffect(() => {
    if (!socket || !user?.id) return;

    getExistingConversations();

    socket.on('message', handleIncomingMessage);
    socket.on('conversation', handleConversationCreated);
    socket.on('message_read', handleMessageRead);

    return () => {
      socket.off('message', handleIncomingMessage);
      socket.off('conversation', handleConversationCreated);
      socket.off('message_read', handleMessageRead);
    };
  }, [socket, user?.id, getExistingConversations]);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        activeConversation,
        setConversations,
        setActiveConversation,
        addMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
