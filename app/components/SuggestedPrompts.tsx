import React from "react";
import PrompSuggestionButton from "./PrompSuggestionButton";

const prompts = [
  "How do I submit an academic appeal at the University of Hull?",

  "What are valid grounds for an academic appeal?",

  "What's the deadline for submitting an appeal after receiving my results?",

  // "Can you explain Stage 1 and Stage 2 of the appeals process?",

  "What evidence do I need to support my appeal?",

  // "What happens if my appeal is successful?",

  // "How do I request an extension for my coursework?",

  // "What qualifies as 'additional consideration' for assessments?",

  // "What's the difference between self-certification and medical evidence for extensions?",

  // "How long can extensions typically be granted for?",

  // "What's the process for requesting additional consideration for exams?",

  "Can I get an extension for technical issues during submission?",
];
const SuggestedPrompts = ({handlePromptClick}) => {
  return <div className="grid grid-cols-3 gap-4 mt-4">
    {
      prompts.map((prompt,index) => {
        return <PrompSuggestionButton text={prompt} onClick={() => handlePromptClick(prompt)} key={`suggestion-${index}`}/>
      })
    }
  </div>;
};

export default SuggestedPrompts;
