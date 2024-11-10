import React from "react";
import { Message } from "../types/Message";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";
import { LoadingMessage } from "./LoadingMessage";
import { Conversation } from "../types/Conversation";
import { NoConversations } from "./NoConversations";

interface Props {
  conversations: Conversation[];
  messages: Message[];
  onSendMessage: (content: string) => void;
  onNewConversation: () => void;
  isLoading: boolean;
}

export const MessageList: React.FC<Props> = ({
  conversations,
  messages,
  onSendMessage,
  onNewConversation,
  isLoading,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {conversations.length === 0 ? (
        <NoConversations onNewConversation={onNewConversation} />
      ) : messages.length === 0 ? (
        <EmptyState onPromptClick={onSendMessage} />
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <LoadingMessage />}
        </>
      )}
    </div>
  );
};
