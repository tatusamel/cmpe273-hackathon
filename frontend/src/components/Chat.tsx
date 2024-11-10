// src/components/Chat.tsx
import React, { useState, useEffect } from "react";
import { Message } from "../types/Message";
import { InputArea } from "./InputArea";
import { MessageList } from "./MessageList";
import { Sidebar } from "./Sidebar";
import { Conversation } from "../types/Conversation";

export const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const BASE_URL = "http://localhost:5001";

  useEffect(() => {
    fetch(`${BASE_URL}/api/conversations`)
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
        if (data.length > 0) {
          setActiveConversationId(data[0].id);
        }
      });
  }, []);

  // Fetch messages when activeConversationId changes
  useEffect(() => {
    if (activeConversationId !== null) {
      fetch(`${BASE_URL}/api/conversations/${activeConversationId}/messages`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
        });
    }
  }, [activeConversationId]);

  const handleNewConversation = () => {
    fetch(`${BASE_URL}/api/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "New Conversation" }),
    })
      .then((res) => res.json())
      .then((newConv) => {
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setMessages([]);
      });
  };

  const handleDeleteConversation = (id: string) => {
    fetch(`${BASE_URL}/api/conversations/${parseInt(id)}`, {
      method: "DELETE",
    }).then(() => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      setActiveConversationId(null);
      setMessages([]);
    });
  };

  const handleRenameConversation = (id: string, title: string) => {
    fetch(`${BASE_URL}/api/conversations/${parseInt(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((updatedConv) => {
        setConversations((prev) =>
          prev.map((conv) => (conv.id === updatedConv.id ? updatedConv : conv))
        );
      });
  };

  const handleSendMessage = (content: string) => {
    if (activeConversationId !== null) {
      const tempUserMessage = {
        id: `temp-${Date.now()}`,
        sender: "user" as "user" | "ai",
        content,
        timestamp: new Date().toISOString(),
        conversation_id: activeConversationId,
      };

      setMessages((prev) => [...prev, tempUserMessage]);
      setIsLoading(true);

      fetch(`${BASE_URL}/api/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to send message");
          return fetch(
            `${BASE_URL}/api/conversations/${activeConversationId}/messages`
          );
        })
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
          setIsLoading(false);
        })
        .catch((error) => {
          // Revert optimistic update on error
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== tempUserMessage.id)
          );
          setIsLoading(false);
          console.error("Error sending message:", error);
        });
    }
  };

  return (
    <div className="min-h-screen bg-[#1f2023] flex">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId ? activeConversationId.toString() : ""}
        onSelect={(id) => setActiveConversationId(parseInt(id))}
        onNew={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />
      <div className="flex-1 flex flex-col h-screen">
        <MessageList
          conversations={conversations}
          messages={messages || []}
          onSendMessage={handleSendMessage}
          onNewConversation={handleNewConversation}
          isLoading={isLoading}
        />
        <InputArea onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
