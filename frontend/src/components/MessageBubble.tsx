import React from "react";
import { Message } from "../types/Message";

interface Props {
  message: Message;
}

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.sender === "user";
  return (
    <div
      className={`mb-3 flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fadeIn`}
    >
      <div
        className={`px-4 py-3 rounded-lg max-w-[80%] shadow-sm
      ${
        isUser ? "bg-[#40414F] text-[#E5E5E5]" : "bg-[#565869] text-[#E5E5E5]"
      } text-[16px] leading-relaxed`}
      >
        {message.content}
      </div>
    </div>
  );
};
