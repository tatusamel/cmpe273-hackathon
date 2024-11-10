import React from "react";
import ReactMarkdown from "react-markdown";
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
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold mb-2">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc ml-4 mb-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-4 mb-2">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-bold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="bg-[#2A2B32] px-1 py-0.5 rounded">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-[#2A2B32] p-3 rounded-md my-2 overflow-x-auto">
                {children}
              </pre>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
