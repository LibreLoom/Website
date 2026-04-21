import React from 'react'
import Card from './Card'

function TeamCard({ name, description, tierBadge, funnyBadge, children }) {
  return (
    <Card>
      <div className="team-card-header">
        <h2 className="team-card-name">{name}</h2>
        {tierBadge && (
          <span className="tier-badge">{tierBadge}</span>
        )}
      </div>
      {funnyBadge && <span className="funny-badge">{funnyBadge}</span>}
      {description && <p>{description}</p>}
      {children}
    </Card>
  )
}

export default TeamCard
