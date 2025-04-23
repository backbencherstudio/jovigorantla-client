
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatConversationProps {
  conversationId: string;
  otherUserName: string;
  listingTitle: string;
  listingId?: string;
  otherUserAvatar?: string;
  messages?: Message[];
  onSendMessage?: (content: string) => void;
  onBack?: () => void;
}
