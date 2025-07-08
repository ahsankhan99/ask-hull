import React from "react";

const PrompSuggestionButton = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer hover:bg-[#18181b]/90 rounded-2xl text-sm min-h-[10dvh] transition-all duration-150 ease-in border-[#3f3f47] border-[1px] 
      p-4 text-start text-white"
    >
      {text}
    </button>
  );
};

export default PrompSuggestionButton;
