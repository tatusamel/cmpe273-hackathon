import React from "react";
import { Message } from "../types/Message";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";

interface Props {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export const MessageList: React.FC<Props> = ({ messages, onSendMessage }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <EmptyState onPromptClick={onSendMessage} />
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  );
};
