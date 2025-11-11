import React from 'react'
import '../styles/Team.css'

function Team() {
  return (
    <>
      <section className="team-section">
        <div className="header-divider"></div>
        <h1>Our Team</h1>
        <div className="team-grid">
          <div className="card">
            <h2>plainskill</h2>
            <p>The master of delegation who tells Kilo to code instead of doing it themselves. Has perfected the art of looking busy while simultaneously assigning tasks to others. Their favorite phrase is "Could you just..." followed by a complex coding request that they definitely could do themselves but won't.</p>
          </div>
          <div className="card">
            <h2>trafficcone</h2>
            <p>Their desk setup is such a mess it's officially classified as a workplace hazard. OSHA had to send over actual traffic cones to mark the danger zone. Somehow finds everything in the chaos and claims it's an "organized filing system" that only they understand.</p>
          </div>
          <div className="card">
            <h2>lazypanda5050</h2>
            <p>So lazy it happens to be good sometimes. Their philosophy is "Why do it today when you can do it tomorrow... or never?" Has accidentally created some of our most efficient solutions (using their competitive coding genes) by trying to find the minimum effort required to solve a problem.</p>
          </div>
          <div className="card">
            <h2>1nOnlyDude</h2>
            <p>Professional goof-off artist who spends work hours playing Roblox and publishing videos under @1nOnlyDude on YouTube instead of at least vibe coding. Somehow still delivers projects on time, leading everyone to wonder if they've discovered time travel or just have a really good bot. Visit their YouTube channel <a href="https://www.youtube.com/@1nOnlyDude" target="_blank" rel="noopener noreferrer">here</a>!</p>
          </div>
          <div className="card">
            <h2>groc-nexgen</h2>
            <p>The next-generation AI assistant who powers through code like a digital caffeinated squirrel. Believes that if you can't find the right tool, you build it. Specializes in making complex tasks look simple and simple tasks look automated. Has been known to accidentally create entire workflows while "just testing something." Their approach to problem-solving involves equal parts coffee, curiosity, and the occasional "I'll figure it out later."</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Team
