import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ArrowLeft, Send, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatBox = () => {
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle sending messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setNewMessage("");
      inputRef.current?.focus();
    }
  };

  // Scroll to bottom when keyboard opens
  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 300); // Small delay to allow keyboard to fully open
    };

    const input = inputRef.current;
    input?.addEventListener("focus", handleFocus);

    return () => {
      input?.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Header - stays fixed at top */}
      <div className="p-3 border-b flex items-center justify-between fixed top-[67px] z-10 bg-blue-400">
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10">
              <UserRound className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <div className="ml-3 flex-1">
            <h3 className="font-medium text-base">vdavvd</h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px] cursor-pointer hover:underline">
              avdvdvd
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable chat area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {/* Chat messages go here */}
        <div className="space-y-2">
          {/* Example messages - replace with your actual messages */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-2 rounded-lg bg-gray-100 max-w-[80%]">
              Message {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Input area - stays fixed at bottom */}
      <div className="p-3 bg-[#f0f2f5] border-t border-gray-200 fixed bottom-12">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-full bg-white border-gray-200 focus:ring-primary/20"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-full bg-primary hover:bg-primary/90 h-10 w-10 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
