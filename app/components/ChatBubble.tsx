const ChatBubble = ({ message }) => {
  const { content, role } = message;
  return (
    <div
      className={`${
        role === "user"
          ? " ml-auto bg-gray-100 text-black"
          : "mr-auto text-white"
      } rounded-sm p-2 text-sm border-0 `}
    >
      {content} 
    </div>
  );
};

export default ChatBubble;
