// import React from "react";
// import { Message } from "@/components/chat/types";
// import MessageBubble from "@/components/chat/MessageBubble";

// interface MessageGroupProps {
//   dateLabel: string;
//   messages: Message[];
//   currentUserId: string;
//   otherUserName: string;
//   otherUserAvatar?: string;
// }

// const MessageGroup: React.FC<MessageGroupProps> = ({
//   dateLabel,
//   messages,
//   currentUserId,
//   otherUserName,
//   otherUserAvatar,
// }) => {
//   return (
//     <div className="space-y-2">
//       {/* Date separator with WhatsApp style */}
//       <div className="flex justify-center">
//         <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-500 shadow-sm">
//           {dateLabel}
//         </span>
//       </div>

//       <div className="space-y-1">
//         {messages.map((message, index) => {
//           const isCurrentUser = message.senderId === currentUserId;
//           const showAvatar =
//             !isCurrentUser &&
//             (index === 0 || messages[index - 1]?.senderId !== message.senderId);

//           // Determine if the message is the first or last in a group from the same sender
//           const isFirstInGroup =
//             index === 0 || messages[index - 1]?.senderId !== message.senderId;
//           const isLastInGroup =
//             index === messages.length - 1 ||
//             messages[index + 1]?.senderId !== message.senderId;

//           return (
//             <MessageBubble
//               key={message.id}
//               message={message}
//               isCurrentUser={isCurrentUser}
//               showAvatar={showAvatar}
//               otherUserName={otherUserName}
//               otherUserAvatar={otherUserAvatar}
//               isFirstInGroup={isFirstInGroup}
//               isLastInGroup={isLastInGroup}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default MessageGroup;

// import React from "react";
// import { Message } from "@/components/chat/types";
// import MessageBubble from "@/components/chat/MessageBubble";

// interface MessageGroupProps {
//   dateLabel: string;
//   messages: Message[];
//   currentUserId: string;
//   otherUserName: string;
//   otherUserAvatar?: string;
// }

// const MessageGroup: React.FC<MessageGroupProps> = ({
//   dateLabel,
//   messages,
//   currentUserId,
//   otherUserName,
//   otherUserAvatar,
// }) => {
//   const groupedBubbles: JSX.Element[] = [];

//   let group: Message[] = [];
//   let prevMessage: Message | null = null;

//   messages.forEach((message) => {
//     const currentSender = message.senderId;
//     const currentTimestamp = new Date(message.timestamp).getTime();

//     const shouldStartNewGroup = () => {
//       if (!prevMessage) return true;
//       const prevSender = prevMessage.senderId;
//       const prevTimestamp = new Date(prevMessage.timestamp).getTime();
//       const timeDiff = Math.abs(currentTimestamp - prevTimestamp) / 1000; // in seconds
//       return currentSender !== prevSender || timeDiff > 60;
//     };

//     if (shouldStartNewGroup()) {
//       if (group.length > 0) {
//         groupedBubbles.push(
//           <div key={group[0].id} className="space-y-1">
//             {group.map((msg, i) => {
//               const isCurrentUser = msg.senderId === currentUserId;
//               return (
//                 <MessageBubble
//                   key={msg.id}
//                   message={msg}
//                   isCurrentUser={isCurrentUser}
//                   showAvatar={i === 0}
//                   otherUserName={otherUserName}
//                   otherUserAvatar={otherUserAvatar}
//                   isFirstInGroup={i === 0}
//                   isLastInGroup={i === group.length - 1}
//                 />
//               );
//             })}
//           </div>
//         );
//       }
//       group = [message];
//     } else {
//       group.push(message);
//     }

//     prevMessage = message;
//   });

//   // Add the last group if any
//   if (group.length > 0) {
//     groupedBubbles.push(
//       <div key={group[0].id} className="space-y-1">
//         {group.map((msg, i) => {
//           const isCurrentUser = msg.senderId === currentUserId;
//           return (
//             <MessageBubble
//               key={msg.id}
//               message={msg}
//               isCurrentUser={isCurrentUser}
//               showAvatar={i === 0}
//               otherUserName={otherUserName}
//               otherUserAvatar={otherUserAvatar}
//               isFirstInGroup={i === 0}
//               isLastInGroup={i === group.length - 1}
//             />
//           );
//         })}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {/* Date separator with WhatsApp style */}
//       <div className="flex justify-center">
//         <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-500 shadow-sm">
//           {dateLabel}
//         </span>
//       </div>

//       {/* Render grouped message bubbles */}
//       {groupedBubbles}
//     </div>
//   );
// };

// export default MessageGroup;

// import React from "react";
// import { Message } from "@/components/chat/types";
// import MessageBubble from "@/components/chat/MessageBubble";

// interface MessageGroupProps {
//   dateLabel: string;
//   messages: Message[];
//   currentUserId: string;
//   otherUserName: string;
//   otherUserAvatar?: string;
// }

// const MessageGroup: React.FC<MessageGroupProps> = ({
//   dateLabel,
//   messages,
//   currentUserId,
//   otherUserName,
//   otherUserAvatar,
// }) => {
//   const groupedBubbles: JSX.Element[] = [];
//   let group: Message[] = [];
//   let prevMessage: Message | null = null;

//   const shouldStartNewGroup = (current: Message, previous: Message | null) => {
//     if (!previous) return true;
//     const currentTime = new Date(current.timestamp).getTime();
//     const previousTime = new Date(previous.timestamp).getTime();
//     const timeGapInSeconds = Math.abs(currentTime - previousTime) / 1000;

//     return (
//       current.senderId !== previous.senderId || timeGapInSeconds > 60
//     );
//   };

//   messages.forEach((message) => {
//     if (shouldStartNewGroup(message, prevMessage)) {
//       if (group.length > 0) {
//         groupedBubbles.push(
//           <div key={group[0].id} className="space-y-1">
//             {group.map((msg, index) => {
//               const isCurrentUser = msg.senderId === currentUserId;
//               return (
//                 <MessageBubble
//                   key={msg.id}
//                   message={msg}
//                   isCurrentUser={isCurrentUser}
//                   showAvatar={index === 0}
//                   otherUserName={otherUserName}
//                   otherUserAvatar={otherUserAvatar}
//                   isFirstInGroup={index === 0}
//                   isLastInGroup={index === group.length - 1}
//                 />
//               );
//             })}
//           </div>
//         );
//       }
//       group = [message];
//     } else {
//       group.push(message);
//     }

//     prevMessage = message;
//   });

//   // Push final group
//   if (group.length > 0) {
//     groupedBubbles.push(
//       <div key={group[0].id} className="space-y-1">
//         {group.map((msg, index) => {
//           const isCurrentUser = msg.senderId === currentUserId;
//           return (
//             <MessageBubble
//               key={msg.id}
//               message={msg}
//               isCurrentUser={isCurrentUser}
//               showAvatar={index === 0}
//               otherUserName={otherUserName}
//               otherUserAvatar={otherUserAvatar}
//               isFirstInGroup={index === 0}
//               isLastInGroup={index === group.length - 1}
//             />
//           );
//         })}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {/* Date label like "Today", "Yesterday" */}
//       <div className="flex justify-center">
//         <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-500 shadow-sm">
//           {dateLabel}
//         </span>
//       </div>

//       {/* Grouped messages */}
//       {groupedBubbles}
//     </div>
//   );
// };

// export default MessageGroup;

import React from "react";
import { Message } from "@/components/chat/types";
import MessageBubble from "@/components/chat/MessageBubble";

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
  otherUserAvatar,
}) => {
  const groupedBubbles: JSX.Element[] = [];
  let group: Message[] = [];
  let prevMessage: Message | null = null;

  const flushGroup = () => {
    if (group.length === 0) return;

    groupedBubbles.push(
      <div key={group[0].id} className="space-y-1">
        {group.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUserId;
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={isCurrentUser}
              showAvatar={index === 0}
              otherUserName={otherUserName}
              otherUserAvatar={otherUserAvatar}
              isFirstInGroup={index === 0}
              isLastInGroup={index === group.length - 1}
            />
          );
        })}
      </div>
    );
    group = [];
  };

  messages.forEach((message) => {
    const currentTimestamp = new Date(message.timestamp).getTime();
    // console.log(message.timestamp)

    if (
      !prevMessage ||
      message.senderId !== prevMessage.senderId ||
      Math.abs(currentTimestamp - new Date(prevMessage.timestamp).getTime()) >
        60 * 1000
    ) {
      flushGroup();
    }

    group.push(message);
    prevMessage = message;
  });

  flushGroup(); // flush any remaining group

  return (
    <div className="space-y-2 pt-10 ">
      <div className="flex justify-center">
        <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-500 shadow-sm">
          {dateLabel}
        </span>
      </div>
      {groupedBubbles}
    </div>
  );
};

export default MessageGroup;
