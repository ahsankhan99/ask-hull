import ReactMarkdown from "react-markdown";

const ChatBubble = ({ message }) => {
  const { content, role } = message;

  return (
    <div
      className={`leading-6 ${
        role === "user"
          ? "ml-auto bg-gray-100 text-black"
          : "mr-auto  text-white"
      } rounded-md p-3 text-sm`}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatBubble;
