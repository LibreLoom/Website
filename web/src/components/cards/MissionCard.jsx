import React from 'react'
import Card from './Card'

function MissionCard({ title, children }) {
  return (
    <Card variant="mission">
      {title && <h2>{title}</h2>}
      {children}
    </Card>
  )
}

export default MissionCard
