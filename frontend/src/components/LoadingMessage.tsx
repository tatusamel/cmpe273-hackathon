export const LoadingMessage = () => (
  <div className="mb-3 flex justify-start animate-fadeIn">
    <div className="px-4 py-3 rounded-lg bg-[#565869] text-[#E5E5E5]">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
      </div>
    </div>
  </div>
);
