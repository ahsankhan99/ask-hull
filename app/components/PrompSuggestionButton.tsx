import React from 'react'

const PrompSuggestionButton = ({onClick, text}) => {
  return (
    <button
    onClick={onClick}
    className=' rounded-2xl bg-[#18181b] p-4 text-start text-white'>
        {text}
    </button>
  )
}

export default PrompSuggestionButton