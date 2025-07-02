const ChatBubble = ({ message }) => {
  const { content, role } = message;
  return (
    <div
      className={`${
        role === "user"
          ? "rounded-bl-5 ml-auto bg-blue-600"
          : "rounded-br-5 mr-auto bg-gray-600"
      } rounded-t-5 m-2 p-2 text-sm border-0 text-white`}
    >
      {content} {/* Add this line */}
    </div>
  );
};

export default ChatBubble;
