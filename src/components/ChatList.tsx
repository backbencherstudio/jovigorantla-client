import { useState } from "react";
import { User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Updated interface for conversation type
export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount: number;
  listingTitle: string;
  isActive: boolean;
}

// Updated interface for component props
interface ChatListProps {
  conversations: Conversation[];
  onSelect: (conversationId: string) => void;
  activeConversationId?: string;
}

const ChatList = ({
  conversations,
  onSelect,
  activeConversationId,
}: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (chat) =>
      chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format the timestamp in a consistent format
  const formatTimeAgo = (date: Date) => {
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });

    // Replace "about" with empty string
    let formattedTime = timeAgo.replace("about ", "");

    // Replace "less than a minute" with "1m"
    formattedTime = formattedTime.replace("less than a minute ago", "1m ago");

    // Replace "X minutes" with "Xm"
    formattedTime = formattedTime.replace(/(\d+) minutes? ago/, "$1m ago");

    // Replace "X hours" with "Xh"
    formattedTime = formattedTime.replace(/(\d+) hours? ago/, "$1h ago");

    // Replace "X days" with "Xd"
    formattedTime = formattedTime.replace(/(\d+) days? ago/, "$1d ago");

    return formattedTime;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Search bar with improved styling */}
      <div className="p-4 border-b border-gray-100 bg-white shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 focus:ring-primary/20 rounded-lg"
          />
        </div>
      </div>
      Conversations list with improved styling
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground p-8">
            No conversations found
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredConversations.map((conv) => (
              <li key={conv.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start p-3 rounded-none transition-colors",
                    activeConversationId === conv.id
                      ? "bg-primary/5"
                      : "hover:bg-gray-50",
                    conv.unreadCount > 0 ? "bg-gray-50 font-medium" : ""
                  )}
                  onClick={() => onSelect(conv.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    {/* Avatar with improved styling */}
                    <div className="flex-shrink-0">
                      <Avatar className="h-12 w-12 border border-gray-100">
                        {conv.otherUser.avatar ? (
                          <AvatarImage
                            src={conv.otherUser.avatar}
                            alt={conv.otherUser.name}
                          />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {conv.otherUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    {/* Message content with improved styling */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium truncate text-foreground">
                          {conv.otherUser.name}
                        </p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(conv.lastMessage.timestamp)}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.listingTitle}
                      </p>

                      <p
                        className={cn(
                          "text-sm truncate mt-1 leading-snug",
                          !conv.lastMessage.isRead
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {conv.lastMessage.text}
                      </p>
                    </div>

                    {/* Unread indicator with improved styling */}
                    {conv.unreadCount > 0 && (
                      <div className="ml-1 self-start mt-1">
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-white">
                          {conv.unreadCount}
                        </div>
                      </div>
                    )}
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
