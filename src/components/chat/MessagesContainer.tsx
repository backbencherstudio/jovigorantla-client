import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/components/chat/types";
import MessageGroup from "@/components/chat/MessageGroup";

interface MessagesContainerProps {
  messages: Message[];
  currentUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
}

const MessagesContainer: React.FC<MessagesContainerProps> = ({
  messages,
  currentUserId,
  otherUserName,
  otherUserAvatar,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    // const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const dateKey = date.toLocaleDateString().split("T")[0];

    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }

    groupedMessages[dateKey].push(message);
  });

  const dateKeys = Object.keys(groupedMessages).sort();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 bg-gray-100">
      <div
        className="space-y-6 p-4 pb-0 mt-6 max-h-[80vh] sm:max-h-[82vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] 
         [&::-webkit-scrollbar]:hidden"
      >
        {dateKeys.map((dateKey) => {
          const dateMessages = groupedMessages[dateKey];
          const date = new Date(dateKey);
          const isToday = new Date().toDateString() === date.toDateString();
          const isYesterday =
            new Date(Date.now() - 86400000).toDateString() ===
            date.toDateString();

          // console.log(dateKey)
          // console.log(date)

          let dateLabel = date.toLocaleDateString();
          // console.log("data label", dateLabel)
          if (isToday) dateLabel = "Today";
          else if (isYesterday) dateLabel = "Yesterday";

          return (
            <MessageGroup
              key={dateKey}
              dateLabel={dateLabel}
              messages={dateMessages}
              currentUserId={currentUserId}
              otherUserName={otherUserName}
              otherUserAvatar={otherUserAvatar}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessagesContainer;
