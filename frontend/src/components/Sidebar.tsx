import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
}

interface Props {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export const Sidebar: React.FC<Props> = ({
  conversations,
  activeId,
  onSelect,
  onNew,
}) => {
  return (
    <div className="w-64 h-screen bg-[#151516] border-r border-[#565869] flex flex-col">
      <Button
        onClick={onNew}
        className="m-4 bg-[#1f2023] hover:bg-[#40414F] text-white"
      >
        <Plus size={16} />
        New Chat
      </Button>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-[90%] p-3 text-left rounded-sm hover:bg-[#1f2023] text-sm mx-auto my-1 flex items-center ${
              activeId === conv.id ? "bg-[#1f2023]" : ""
            } text-[#E5E5E5]`}
          >
            {conv.title}
          </button>
        ))}
      </div>
    </div>
  );
};
