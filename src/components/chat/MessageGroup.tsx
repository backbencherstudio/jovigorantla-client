
import React from 'react';
import { Message } from '@/components/chat/types';
import MessageBubble from '@/components/chat/MessageBubble';

interface MessageGroupProps {
  dateLabel: string;
  messages: Message[];
  currentUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
}

const MessageGroup: React.FC<MessageGroupProps> = ({
  dateLabel,
  messages,
  currentUserId,
  otherUserName,
  otherUserAvatar
}) => {
  return (
    <div className="space-y-2">
      {/* Date separator with WhatsApp style */}
      <div className="flex justify-center">
        <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-500 shadow-sm">
          {dateLabel}
        </span>
      </div>
      
      <div className="space-y-1">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          const showAvatar = !isCurrentUser && (index === 0 || 
            messages[index - 1]?.senderId !== message.senderId);
            
          // Determine if the message is the first or last in a group from the same sender
          const isFirstInGroup = index === 0 || messages[index - 1]?.senderId !== message.senderId;
          const isLastInGroup = index === messages.length - 1 || 
            messages[index + 1]?.senderId !== message.senderId;
            
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              showAvatar={showAvatar}
              otherUserName={otherUserName}
              otherUserAvatar={otherUserAvatar}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MessageGroup;
