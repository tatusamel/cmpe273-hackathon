import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleArrowUp } from "lucide-react";

interface Props {
  onSendMessage: (content: string) => void;
}

export const InputArea: React.FC<Props> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="p-4 border-t border-[#565869] bg-[#1f2023]">
      <div className="max-w-[720px] mx-auto flex gap-2">
        <Input
          className="flex-1 bg-[#40414F] border-none text-[#e5e5e5] placeholder:text-[#8E8E8F] focus-visible:ring-[#10A37F]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          className="bg-[#f5f5f5] hover:bg-[#0E916F] text-black flex justify-center items-center h-10 w-10 rounded-full"
          aria-label="Send message"
        >
          <CircleArrowUp className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
