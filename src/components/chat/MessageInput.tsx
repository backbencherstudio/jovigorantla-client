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

  const isTrackingKeyboard = useRef(false);
  const resizeListener = useRef(null);

  const startKeyboardTracking = () => {
    if (isTrackingKeyboard.current || !window.visualViewport) return;
    isTrackingKeyboard.current = true;

    resizeListener.current = () => {
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      const keyboardHeight = windowHeight - viewportHeight;
      const chatFooter = document.querySelector(".chat-footer") as HTMLElement; // Select your footer

      if (keyboardHeight > 100) {
        // Keyboard is open — move footer up
        chatFooter.style.transform = `translateY(-${keyboardHeight}px)`;
      } else {
        // Keyboard closed — reset position
        chatFooter.style.transform = "translateY(0)";
      }
    };

    window.visualViewport.addEventListener("resize", resizeListener.current);
  };

  const stopKeyboardTracking = () => {
    if (!isTrackingKeyboard.current || !window.visualViewport) return;
    isTrackingKeyboard.current = false;

    window.visualViewport.removeEventListener("resize", resizeListener.current);
    const chatFooter = document.querySelector(".chat-footer") as HTMLElement;
    chatFooter.style.transform = "translateY(0)";
  };


  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleFocus = () => {
      startKeyboardTracking();
    };

    const handleBlur = () => {
      setTimeout(() => {
        if (document.activeElement !== inputElement) {
          stopKeyboardTracking();
        }
      }, 100);
    };

    inputElement.addEventListener('focus', handleFocus);
    inputElement.addEventListener('blur', handleBlur);

    // Cleanup
    return () => {
      inputElement.removeEventListener('focus', handleFocus);
      inputElement.removeEventListener('blur', handleBlur);
      stopKeyboardTracking();
    };
  }, []);
  

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
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
    <div className="chat-footer">
      {/* fixed bottom-0   */}
      <div className="p-[14px] bg-[#f0f2f5] border-t border-gray-200 w-full mx-auto max-w-3xl md:max-w-[35rem] xl:max-w-[47rem] ">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-full bg-white border-gray-200 focus:ring-primary/20"
          />
          <Button
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
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
