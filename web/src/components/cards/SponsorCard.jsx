import React from 'react'
import Card from './Card'

function SponsorCard({ name, amount, badge, note, children }) {
  return (
    <Card variant="sponsor">
      {badge && (
        <div className="sponsor-mark">
          <span className="sponsor-dot" aria-hidden="true">●</span>
          <span className="sponsor-mark-text">{badge}</span>
        </div>
      )}
      <h2>{name}</h2>
      {amount && <p><strong>Donation:</strong> {amount}</p>}
      {note && <p>{note}</p>}
      {children}
    </Card>
  )
}

export default SponsorCard
