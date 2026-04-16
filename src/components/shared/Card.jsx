import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  hover = false,
  padding = 'p-4'
}) => {
  const baseClasses = 'card'
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${padding} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
