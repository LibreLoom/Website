import React from 'react'
import Card from './Card'

function TeamCard({ name, description, children }) {
  return (
    <Card>
      <h2>{name}</h2>
      {description && <p>{description}</p>}
      {children}
    </Card>
  )
}

export default TeamCard
