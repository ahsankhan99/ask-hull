import React from 'react'

const ChatBubble = ({message}) => {
  const {content, role } = message;
  return (
    <div className={`${role === 'user' ? 'rounded-bl-5 ml-auto' : 'rounded-br-5 mr-auto '} rounded-t-5  m-2 p-2 text-sm border-0 text-amber-200`}>
      
    </div>
  )
}

export default ChatBubble