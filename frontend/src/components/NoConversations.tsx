// src/components/NoConversations.tsx
import React from "react";
import { Plus } from "lucide-react";

interface Props {
  onNewConversation: () => void;
}

export const NoConversations: React.FC<Props> = ({ onNewConversation }) => (
  <div className="flex flex-col items-center justify-center h-full text-[#E5E5E5]">
    <h3 className="text-xl font-medium mb-4">
      Welcome to Researcher Food Security
    </h3>
    <p className="text-sm text-[#8E8E8F] mb-6">
      Start a new conversation to begin
    </p>
    <button
      onClick={onNewConversation}
      className="flex items-center gap-2 px-4 py-2 bg-[#40414F] hover:bg-[#2A2B32] rounded-lg transition-colors"
    >
      <Plus size={16} />
      New Conversation
    </button>
  </div>
);
