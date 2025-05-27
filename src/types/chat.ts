export type Message = {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    read: boolean;
  };
  
//   export type Conversation = {
//     id: string;
//     creator_id: string;
//     participant_id: string;
//     listingId: string;
//     listingTitle: string;
//     lastMessage: Message;
//     unreadCount: number;
//     messages: Message[];
//     creator?: { id: string; name: string; avatar?: string };
//     participant?: { id: string; name: string; avatar?: string };
//   };
  