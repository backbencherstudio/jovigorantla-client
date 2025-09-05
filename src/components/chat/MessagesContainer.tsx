import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/components/chat/types";
import MessageGroup from "@/components/chat/MessageGroup";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

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
    // const date = new Date(message.timestamp);
    // // const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    // const dateKey = date.toLocaleDateString().split("T")[0];

    // From your timestamp (automatically uses local timezone)
    const date = dayjs(message.timestamp).local();
    const dateKey = date.format("YYYY-MM-DD"); // Converted to your local timezone
    console.log(
      dateKey,
      new Date(dateKey),
      new Date().toDateString(),
      dayjs().format("YYYY-MM-DD")
    );

    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }

    groupedMessages[dateKey].push(message);
  });

  // const dateKeys = Object.keys(groupedMessages).sort();
  // const dateKeys = Object.keys(groupedMessages).sort((a, b) => {
  //   const dateA = new Date(a); // Convert dateKey to Date object
  //   const dateB = new Date(b); // Convert dateKey to Date object
  //   return dateB.getTime() - dateA.getTime(); // Compare based on time (numeric comparison)
  // });

  const dateKeys = Object.keys(groupedMessages).sort((a, b) => {
    const dateA = dayjs(a); // parse key into dayjs
    const dateB = dayjs(b);
    return dateB.valueOf() - dateA.valueOf(); // compare timestamps
  });

  // Scroll to bottom of messages
  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // messagesEndRef.current?.;
  }, [messages]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  return (
   
      <div className="px-4 pb-3 pt-[10px] w-full overflow-y-auto  flex flex-col-reverse [scrollbar-width:none] [-ms-overflow-style:none] 
[&::-webkit-scrollbar]:hidden ">
        {dateKeys.map((dateKey) => {
          // const dateMessages = groupedMessages[dateKey];
          // const date = new Date(dateKey);
          // const isToday = new Date().toDateString() === date.toDateString();
          // const isYesterday =
          //   new Date(Date.now() - 86400000).toDateString() ===
          //   date.toDateString();

          // // console.log(dateKey)
          // // console.log(date)

          // let dateLabel = date.toLocaleDateString();
          // // console.log("data label", dateLabel)
          // if (isToday) dateLabel = "Today";
          // else if (isYesterday) dateLabel = "Yesterday";

          const dateMessages = groupedMessages[dateKey];
          const date = dayjs(dateKey); // ✅ instead of new Date(dateKey)

          const isToday = dayjs().isSame(date, "day");
          const isYesterday = dayjs().subtract(1, "day").isSame(date, "day");

          let dateLabel = date.format("M/D/YYYY"); // e.g., 8/26/2025
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

  );
};

export default MessagesContainer;

// import React, { useRef, useEffect } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Message } from "@/components/chat/types";
// import MessageGroup from "@/components/chat/MessageGroup";

// interface MessagesContainerProps {
//   messages: Message[];
//   currentUserId: string;
//   otherUserName: string;
//   otherUserAvatar?: string;
// }

// const MessagesContainer: React.FC<MessagesContainerProps> = ({
//   messages,
//   currentUserId,
//   otherUserName,
//   otherUserAvatar,
// }) => {
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Group messages by date
//   const groupedMessages: { [key: string]: Message[] } = {};

//   messages.forEach((message) => {
//     const date = new Date(message.timestamp);
//     const dateKey = date.toLocaleDateString().split("T")[0]; // get a string like "MM/DD/YYYY"

//     if (!groupedMessages[dateKey]) {
//       groupedMessages[dateKey] = [];
//     }

//     groupedMessages[dateKey].push(message);
//   });

//   // Get the date keys and sort them based on actual Date object comparison
//   const dateKeys = Object.keys(groupedMessages).sort((a, b) => {
//     const dateA = new Date(a);
//     const dateB = new Date(b);
//     return dateA.getTime() - dateB.getTime(); // Compare dates numerically
//   });

//   // Scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <ScrollArea className="flex-1 bg-gray-100 ">
//       <div
//         className="space-y-6 p-4 pb-0 mt-6 max-h-[80vh] sm:max-h-[82vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]
//          [&::-webkit-scrollbar]:hidden"
//       >
//         {dateKeys.map((dateKey) => {
//           const dateMessages = groupedMessages[dateKey];
//           const date = new Date(dateKey);
//           const isToday = new Date().toDateString() === date.toDateString();
//           const isYesterday =
//             new Date(Date.now() - 86400000).toDateString() ===
//             date.toDateString();

//           let dateLabel = date.toLocaleDateString();
//           if (isToday) dateLabel = "Today";
//           else if (isYesterday) dateLabel = "Yesterday";

//           return (
//             <MessageGroup
//               key={dateKey}
//               dateLabel={dateLabel}
//               messages={dateMessages}
//               currentUserId={currentUserId}
//               otherUserName={otherUserName}
//               otherUserAvatar={otherUserAvatar}
//             />
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>
//     </ScrollArea>
//   );
// };

// export default MessagesContainer;
