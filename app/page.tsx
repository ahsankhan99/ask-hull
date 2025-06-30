"use client";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";
import SuggestedPrompts from "./components/SuggestedPrompts";
import LoadingBubble from "./components/LoadingBubble";
import ChatBubble from "./components/ChatBubble";

export default function Home() {
  const { append, messages, input, handleSubmit, handleInputChange, status } =
    useChat();
  const noMessages = true;
  return (
    <main className="w-[80dvw] h-[80dvh] bg-blue-50 flex justify-between items-center flex-col rounded-2xl p-5">
      <Image
        width={300}
        height={120}
        src={"/ask-hull.png"}
        alt="Ask Hull Logo Image"
      />
      <section className={noMessages ? " " : " "}>
        {noMessages ? (
          <>
            <p className="">
              Confused by university rules? Ask me anything about assessments,
              deadlines, or degree requirements - I’ll explain the regulations
              in plain English.
            </p>
            <br />
            <p className="italic">
              For official confirmation, always check your program handbook.
            </p>
            <SuggestedPrompts onClick={() => {}} />
          </>
        ) : (
          <>
            {messages.map((messages, index) => (
              <ChatBubble />
            ))}
            <LoadingBubble />
            {/* <span className="h-full flex flex-col justify-end overflow-scroll"></span> */}
          </>
        )}
      </section>
      <form
        className="min-h-[50px] w-full flex border-t-1 p-2 overflow-hidden"
        onSubmit={handleSubmit}
      >
        <input
          className="max-w-[85%] w-full p-2 border-none outline-0"
          type="text"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something"
        />
        <input
          className="max-w-[15%] cursor-pointer w-full bg-[#0e1647] text-white"
          type="submit"
          value="Search"
        />
      </form>
    </main>
  );
}
