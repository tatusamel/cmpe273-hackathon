// src/components/Chat.tsx
import React, { useState } from "react";
import { Message } from "../types/Message";
import { InputArea } from "./InputArea";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Hunger in Africa",
      createdAt: new Date(),
      messages: [],
    },
    {
      id: "2",
      title: "Possible solutions for ...",
      createdAt: new Date(),
      messages: [],
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState("1");
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      createdAt: new Date(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, userMessage],
            title: content.slice(0, 30) + "...",
          };
        }
        return conv;
      })
    );

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: "Alright, I am looking into it.",
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, aiMessage],
            };
          }
          return conv;
        })
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1f2023] flex">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNew={handleNewConversation}
      />
      <div className="flex-1 flex flex-col h-screen">
        <MessageList
          messages={activeConversation?.messages || []}
          onSendMessage={handleSendMessage}
        />
        <InputArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
