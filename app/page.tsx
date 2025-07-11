"use client";
import { useChat, Message } from "@ai-sdk/react";
import SuggestedPrompts from "./components/SuggestedPrompts";
import ChatBubble from "./components/ChatBubble";
import LoadingBubble from "./components/LoadingBubble";

export default function Home() {
  const { append, messages, input, handleSubmit, handleInputChange,status } = useChat({
    api: "/api/chat",
  });

  console.log(messages)
  const handlePromptClick = (prompt: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      content: prompt,
      role: "user",
    };
    append(message);
  };

  const noMessages = !messages || messages.length === 0;
  return (
    <main className="lg:min-w-[60dvw] lg:max-w-[60dvw] w-full h-full flex justify-between items-center flex-col">
      <section
        className={`${
          noMessages ? " " : " "
        } flex flex-col gap-4 relative overflow-x-hidden overflow-y-scroll w-full h-full no-scrollbar py-4`}
      >
        {noMessages ? (
          <div className="flex flex-col justify-between h-full">
            <p className="text-white">
              Confused by university rules? Ask me anything about assessments,
              deadlines, or degree requirements - I’ll explain the regulations
              in plain English.
            </p>
                        
            <SuggestedPrompts handlePromptClick={handlePromptClick} />
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}
            
            {(status === "submitted" || status === "streaming") && (
              <div className="mr-auto mb-10">
                <LoadingBubble />
              </div>
            )}
          </>
        )}
      </section>
      <form
        className="min-h-[100px] w-full flex overflow-hidden"
        onSubmit={handleSubmit}
      >
        <textarea
          className="no-scrollbar w-full text-white p-3 bg-[#3f3f47]/30 rounded-2xl border border-[#3f3f47] focus:outline-none focus:border-white resize-none"
          rows={1}
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </form>
    </main>
  );
}
