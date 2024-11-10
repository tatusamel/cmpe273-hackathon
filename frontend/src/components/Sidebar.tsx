import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";

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
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
}

export const Sidebar: React.FC<Props> = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState("");

  return (
    <div className="w-64 h-screen bg-[#151516] border-r border-[#565869] flex flex-col">
      <Button
        onClick={onNew}
        className="m-4 w-[calc(100%-2rem)] bg-[#1f2023] hover:bg-[#40414F] text-white"
      >
        <Plus size={16} />
        New Chat
      </Button>
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.map((conv) => (
          <div key={conv.id} className="w-full mb-2">
            {editingId === conv.id ? (
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() => {
                  onRenameConversation(conv.id, newTitle);
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onRenameConversation(conv.id, newTitle);
                    setEditingId(null);
                  }
                }}
                className="flex-1 p-3 text-sm bg-transparent text-white"
              />
            ) : (
              <div
                className={`group flex items-center justify-between p-3 rounded-sm hover:bg-[#1f2023] ${
                  activeId === conv.id ? "bg-[#1f2023]" : ""
                }`}
              >
                <button
                  onClick={() => onSelect(conv.id)}
                  className="flex-1 text-left text-sm text-[#E5E5E5] truncate"
                >
                  {conv.title}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(conv.id);
                      setNewTitle(conv.title);
                    }}
                    className="p-1 text-white hover:text-blue-400"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="p-1 text-white hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
