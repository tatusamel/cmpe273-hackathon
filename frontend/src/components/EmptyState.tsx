// src/components/EmptyState.tsx
import React from "react";

interface Props {
  onPromptClick: (prompt: string) => void;
}

export const EmptyState: React.FC<Props> = ({ onPromptClick }) => {
  const prompts = [
    "List major Food insecurity reason in 2024",
    "Explain malnutrition in war zones",
    "Explain increase prices impact on food security",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-[#E5E5E5]">
      <h3 className="text-xl font-medium mb-6">How can I help you today?</h3>
      <div className="space-y-4 w-[600px] max-w-[90%]">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="w-full p-4 rounded-lg border border-[#565869] 
              hover:bg-[#40414F] transition-colors duration-200
              text-left text-sm"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
