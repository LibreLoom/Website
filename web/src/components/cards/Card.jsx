import React from 'react'
import './Card.css'

function Card({ children, className = '', variant = '', ...props }) {
  const variantClass = variant ? `card--${variant}` : ''
  const classes = ['card', variantClass, className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card
