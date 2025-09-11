import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");

      // Re-focus the input field to keep the keyboard open

      //inputRef.current?.focus();

      // setTimeout(() => {
      //   inputRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
      //   inputRef.current?.focus();
      // }, 50);
    }
  };
  const [width, setWidth] = useState("768px");
  useEffect(() => {
    // Function to update width based on screen size
    const updateWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024 && screenWidth < 1300) {
        setWidth(`${screenWidth - 540}px`);
      } else if (screenWidth <= 840 && screenWidth >= 768) {
        setWidth(`${screenWidth - 80}px`);
      } else if (screenWidth < 768) {
        setWidth(`${screenWidth - 10}px`);
      } else {
        setWidth("768px");
      }
    };
    // Set initial width
    updateWidth();
    // Add event listener for window resize
    window.addEventListener("resize", updateWidth);
    // Clean up event listener
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    // max-w-xl lg:max-w-[30rem] xl:max-w-3xl w-full
    <div>
      <div className="p-[14px] bg-[#f0f2f5] fixed bottom-0  border-t border-gray-200 w-full mx-auto max-w-3xl md:max-w-[35rem] xl:max-w-[47rem] ">
        <form className="flex gap-2">
          <Input
            placeholder="Type a message..."
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-full bg-white border-gray-200 focus:ring-primary/20"
          />
          <Button
           onClick={handleSendMessage} 
            type="button"
            size="icon"
            disabled={!newMessage.trim()}
            className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
      {/* <div className="h-5"></div> */}
    </div>
  );
};

export default MessageInput;
