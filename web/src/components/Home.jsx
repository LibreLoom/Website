import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import abstractImg1 from '../assets/abstract/yupp-generated-image-524118.png'
import abstractImg2 from '../assets/abstract/yupp-generated-image-622587.png'
import abstractImg3 from '../assets/abstract/yupp-generated-image-626277.png'
import abstractImg4 from '../assets/abstract/yupp-generated-image-691537.png'
import abstractImg5 from '../assets/abstract/yupp-generated-image-781807.png'
import abstractImg6 from '../assets/abstract/OG (Seedream 4.0 Max on Yupp.ai).png'

function Home() {
  const [imageStyles, setImageStyles] = useState([])
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [enlargedImage, setEnlargedImage] = useState(null)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const images = [
      { src: abstractImg1 },
      { src: abstractImg2 },
      { src: abstractImg3 },
      { src: abstractImg4 },
      { src: abstractImg5 },
      { src: abstractImg6 }
    ]

    // Don't show images on small screens to prevent overlap with content
    if (screenWidth < 1024) {
      setImageStyles([])
      return
    }

    const generateRandomStyle = (index, totalImages, usedPositions) => {
      const rotations = [-5, 8, 3, -7, 4, -3]
      
      // Generate random size between 150px and 280px
      const randomSize = Math.floor(Math.random() * 130) + 150
      
      // Define safe zones with more spacing - reduced vertical range to prevent scrolling
      const safeZones = [
        { topMin: 100, topMax: 180, leftMin: 2, leftMax: 8, rightMin: 2, rightMax: 8 },    // Top area
        { topMin: 250, topMax: 330, leftMin: 2, leftMax: 8, rightMin: 2, rightMax: 8 },    // Upper middle area
        { topMin: 400, topMax: 480, leftMin: 2, leftMax: 8, rightMin: 2, rightMax: 8 },    // Lower middle area
        { topMin: 550, topMax: 630, leftMin: 2, leftMax: 8, rightMin: 2, rightMax: 8 }     // Bottom area
      ]
      
      // Count how many images are on each side to balance distribution
      const leftCount = usedPositions.filter(pos => pos.left !== undefined).length
      const rightCount = usedPositions.filter(pos => pos.right !== undefined).length
      
      // Generate truly random positions within safe bounds
      let position
      let attempts = 0
      const maxAttempts = 200
      
      do {
        // Bias towards the side with fewer images, but still allow randomness
        let useLeft
        if (leftCount === rightCount) {
          useLeft = Math.random() > 0.5
        } else if (leftCount < rightCount) {
          useLeft = Math.random() > 0.3 // 70% chance to use left
        } else {
          useLeft = Math.random() > 0.7 // 30% chance to use left
        }
        
        const selectedZone = safeZones[Math.floor(Math.random() * safeZones.length)]
        
        position = {
          top: selectedZone.topMin + Math.random() * (selectedZone.topMax - selectedZone.topMin),
          size: randomSize
        }
        
        if (useLeft) {
          position.left = selectedZone.leftMin + Math.random() * (selectedZone.leftMax - selectedZone.leftMin)
        } else {
          position.right = selectedZone.rightMin + Math.random() * (selectedZone.rightMax - selectedZone.rightMin)
        }
        
        // Check for overlaps with existing images
        const overlaps = usedPositions.some(used => {
          // Calculate actual pixel positions for overlap detection
          const viewportWidth = window.innerWidth
          const currentLeft = position.left !== undefined ? (position.left / 100) * viewportWidth : viewportWidth - ((position.right / 100) * viewportWidth) - randomSize
          const currentRight = currentLeft + randomSize
          const currentTop = position.top
          const currentBottom = currentTop + randomSize
          
          const usedLeft = used.left !== undefined ? (used.left / 100) * viewportWidth : viewportWidth - ((used.right / 100) * viewportWidth) - used.size
          const usedRight = usedLeft + used.size
          const usedTop = used.top
          const usedBottom = usedTop + used.size
          
          // Add padding between images
          const padding = 30
          
          const horizontalOverlap = currentLeft < (usedRight + padding) && currentRight > (usedLeft - padding)
          const verticalOverlap = currentTop < (usedBottom + padding) && currentBottom > (usedTop - padding)
          
          return horizontalOverlap && verticalOverlap
        })
        
        if (!overlaps || attempts > maxAttempts) {
          break
        }
        
        attempts++
      } while (true)
      
      usedPositions.push(position)
      
      const style = {
        position: 'absolute',
        width: `${randomSize}px`,
        aspectRatio: '1',
        borderRadius: '28px',
        overflow: 'hidden',
        pointerEvents: 'auto',
        zIndex: 2,
        border: '2px solid var(--secondary)',
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.3s ease',
        cursor: 'pointer',
        transform: `rotate(${rotations[index] + (Math.random() - 0.5) * 4}deg)`
      }

      // Apply position
      if (position.left !== undefined) {
        style.left = `${position.left}%`
      }
      if (position.right !== undefined) {
        style.right = `${position.right}%`
      }
      style.top = `${position.top}px`

      return style
    }

    const usedPositions = []
    const styles = images.map((_, index) => generateRandomStyle(index, images.length, usedPositions))
    setImageStyles(styles)
  }, [screenWidth])

  return (
    <>
      {imageStyles.map((style, index) => {
        const images = [abstractImg1, abstractImg2, abstractImg3, abstractImg4, abstractImg5, abstractImg6]
        return (
          <div
            key={index}
            className="decorative-img"
            style={style}
            onClick={() => setEnlargedImage(images[index])}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `${style.transform} scale(1.05) translateY(-5px)`
              e.currentTarget.style.borderColor = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = style.transform
              e.currentTarget.style.borderColor = 'var(--secondary)'
            }}
          >
            <img src={images[index]} alt="" />
          </div>
        )
      })}

      {enlargedImage && (
        <div
          className="enlarged-image-overlay"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="enlarged-image-container">
            <img src={enlargedImage} alt="Enlarged view" />
          </div>
        </div>
      )}

      <header>
        <div className="logo-container">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <ellipse className="logo-svg-bg" cx="250" cy="228.786" rx="132.72" ry="134.19"/>
            <path className="logo-svg-fg" d="m 185.2795,134.97602 c 0.83,-2.97 8.24,-2.27 8.24,0.75 v 10.86 h 18.74 v -12.74 c 0.64,-0.31 2.25,0.64 2.25,1.12 v 11.61 h 6 v -12.74 c 0.64,-0.31 2.25,0.64 2.25,1.12 v 11.61 c 1.21,0.07 6,0.32 6,-1.12 v -11.61 h 1.5 v 11.61 c 0,1.6 6.75,1.6 6.75,0 v -11.61 h 1.5 v 12.74 h 6 v -11.61 c 0,-0.49 1.61,-1.44 2.25,-1.12 v 11.61 c 0,1.45 4.78,1.19 6,1.12 v -11.61 c 0,-0.49 1.61,-1.44 2.25,-1.12 v 12.74 h 6 v -11.61 c 0,-0.49 1.61,-1.44 2.25,-1.12 v 12.74 h 6 v -11.61 c 0,-0.49 1.61,-1.44 2.25,-1.12 v 12.74 h 6 v -11.61 c 0,-0.49 1.61,-1.44 2.25,-1.12 v 12.74 h 6 v -11.61 c 0,-0.49 1.61,-1.44 2.25,-1.12 v 12.74 h 17.99 c 0.2,-4.56 -1.83,-14.77 5.59,-13.49 0.97,0.17 3.41,2.15 3.41,2.63 v 10.86 h 10.87 c 4.16,0 4.04,8.99 0.75,8.99 h -11.62 v 134.1 h 11.62 c 0.84,0 2.61,2.82 2.67,4.1 0.09,1.73 -2.06,4.89 -3.42,4.89 h -10.87 v 10.86 c 0,3.87 -8.99,4.23 -8.99,0 v -10.86 c -6.41,-2.1 -12.06,10.58 -16.27,11.83 -2.84,0.84 -13.53,0.54 -13.53,0.54 -0.46,1.87 -3.01,3.53 -4.68,3.11 -4.47,-1.11 -3.9,-5.45 -1.5,-7.37 1.91,-1.53 6.35,0.68 6.38,2.36 0,0 10.42,0.27 11.83,-0.14 1.99,-0.59 8.32,-8.44 10.27,-10.33 h -59.96 c -0.35,10.01 4.35,10.21 4.35,10.21 1.8,0.03 8.91,0.22 12.15,0.27 0.34,0.34 0,9.36 0,9.36 3.72,0.27 4.08,6.08 -1.11,6.08 -4.47,0 -3.94,-5.96 -1.12,-6.11 0,0 -0.16,-4.49 -0.03,-7.08 -2.85,-0.43 -10.73,-0.48 -10.73,-0.48 -0.54,-0.27 -2.53,-2.35 -4.68,-6.13 0,0 -0.34,-5.67 -0.34,-6.13 h -42.72 c -1.94,4.04 1.69,14.2 -4.85,14.29 -6.54,0.09 -4.57,-9.89 -4.89,-14.29 h -10.87 c -4.07,0 -3.68,-8.99 -0.75,-8.99 h 11.24 v -134.1 h -11.24 c -2.94,0 -2.15,-8.99 0.75,-8.99 h 11.62 c 0.56,-3.14 -0.76,-8.89 0,-11.61 z m 26.98,20.6 h -17.61 c -0.08,0 -1.12,1.04 -1.12,1.12 v 132.98 h 34.1 c 0.08,0 1.12,-1.04 1.12,-1.12 v -43.45 c 0,-1.27 -6.49,-0.62 -6.75,-0.38 -0.37,0.35 0,11.61 0,11.61 0,0 2.22,1.29 2.09,2.88 -0.31,3.88 -5.78,3.72 -5.65,-0.52 0.07,-2.32 2.06,-1.82 2.06,-1.98 v -11.99 c -5.74,-0.12 -6.38,-1.18 -6.78,4.84 -0.25,3.85 0.03,23.59 0.03,23.59 -0.28,0.49 -6.91,5.57 -7.3,6.23 0,0 0.01,2.55 -0.89,3.23 -2.64,1.98 -6.81,-1.66 -4.21,-4.19 1.58,-1.54 4.38,-0.53 4.38,-0.53 1.8,-0.94 6.79,-5.25 6.86,-6.17 0.10,-1.29 0.16,-24.31 -0.46,-26.52 -0.62,-2.21 -11.55,2.23 -9.57,-3.77 0.74,-2.24 7.6,-0.82 9.68,-1.2 v -84.65999 z m 8.25,0 c -1.25,0 -6.75,-0.44 -6.75,1.12 v 83.53 h 6.75 v -84.66 z m 8.24,0 c -1.25,0 -6.75,-0.44 -6.75,1.12 v 83.53 h 6.75 v -84.66 z m 8.25,84.65 v -83.53 c 0,-1.56 -5.5,-1.12 -6.75,-1.12 v 84.66 h 6.75 z m 1.49,0 c 2.31,-0.27 6.28,1.17 6.75,-1.87 l -0.33,-82.08 c -0.92,-1.32 -4.75,-0.51 -6.42,-0.7 v 84.66 z m 8.25,0 c 2.31,-0.27 6.28,1.17 6.75,-1.87 l -0.33,-82.08 c -0.92,-1.32 -4.75,-0.51 -6.42,-0.7 v 84.66 z m 8.24,0 c 2.31,-0.27 6.28,1.17 6.75,-1.87 l -0.33,-82.08 c -0.92,-1.32 -4.75,-0.51 -6.42,-0.7 v 84.66 z m 8.25,0 c 2.31,-0.27 6.28,1.17 6.75,-1.87 l -0.33,-82.08 c -0.92,-1.32 -4.75,-0.51 -6.42,-0.7 v 84.66 z m 8.24,0 c 2.31,-0.27 6.28,1.17 6.75,-1.87 l -0.33,-82.08 c -0.92,-1.32 -4.75,-0.51 -6.42,-0.7 v 84.66 z m 8.25,0 c 2.31,-0.27 6.28,1.17 6.75,-1.87 l -0.33,-82.08 c -0.92,-1.32 -4.75,-0.51 -6.42,-0.7 v 84.66 z m 26.23,-84.65 h -17.99 v 84.66 c 3.83,0.44 9.92,-1.98 9,3.74 h -9 c 0.08,2.22 -0.34,4.97 -0.31,6.77 0.02,1.23 2.48,1.43 2.4,2.76 -0.24,3.66 -6.01,4.03 -5.64,0.29 0.19,-1.91 1.26,-1.61 1.32,-2.85 0.09,-1.86 -0.04,-4.45 -0.02,-6.97 -1.07,0.87 -5.99,0.44 -5.99,0.75 v 22.47 c 2.23,0.37 8.16,0.26 8.16,0.26 6,-4.63 6.43,4.84 2.24,3.54 -0.96,-0.3 -1.81,-1.42 -2.68,-1.57 -3.54,-0.6 -7.72,1.06 -9.22,-1.11 v -23.22 c 0,-1.6 -6.75,-1.6 -6.75,0 v 21.73 c 0,0.14 1.39,1 1.54,2.29 0.39,3.39 -4.95,4.55 -5.32,0.67 -0.2,-2.11 1.98,-2.02 2.28,-4.46 0.22,-1.77 0.31,-18.88 -0.09,-20.11 -0.68,-2.08 -4.81,-1.01 -6.64,-1.23 0.99,9.37 -0.41,20.8 -0.05,29.93 0,0 4.69,4.62 -1.02,6.28 -1.77,0.51 -6.22,-2.46 -1.09,-6.29 0.4,-6.45 0.73,-19.58 0.68,-28.04 -0.02,-3.11 -4.37,-1.6 -6.75,-1.87 v 11.61 c 0,0.58 -8.24,7.66 -8.24,8.24 v 25.85 h 59.21 v -134.1 z m -75.7,89.52 v 44.58 c 1.83,-0.22 5.96,0.86 6.64,-1.23 0.37,-1.13 0.75,-14.11 0.75,-14.11 -1.48,-0.23 -2.6,-1.08 -2.67,-3.18 -0.07,-2.1 2.03,-2.96 2.03,-2.96 0.3,-2.55 0.41,-21.42 -0.1,-22.99 -0.66,-2 -6.17,-1.63 -6.64,-0.1 z m 16.49,16.11 c 8.24,-9.64 6.75,-2.05 6.78,-14.65 0.01,-4.23 -6.78,-2.25 -6.78,-1.82999 z m -1.5,28.47 v -44.58 c 0,-1.25 -5.91,-2.11 -6.64,0.1 -0.42,1.26 -0.45,21.02 -0.09,22.87 0,0 2.49,1.02 2.6,2.67 0.16,2.39 -1.97,3.44 -1.97,3.44 0,0 0.06,11.24 -0.65,15.49 h 6.75 z"/>
            <text x="119.056" y="404.636" style={{fontFamily: 'FreeMono,monospace', fontSize: '48px'}} className="logo-svg-bg">LibreLoom</text>
          </svg>
        </div>
        <h1>This is LibreLoom.</h1>
        <p>Weaving free and open-source software for everyone. Our mission is to bring easy and free to use tools to every person and every community.</p>
      </header>

      <section className="mission-section">
        <div className="mission-card">
          <h2>Our Mission</h2>
          <p>At LibreLoom, we believe in the power of free and open source software to transform lives. We build tools that respect your freedom, protect your privacy, and put you in control. Every project we create is designed with transparency, accessibility, and community at its core. Join us in weaving a better digital future — one that belongs to everyone.</p>
        </div>
      </section>
    </>
  )
}

export default Home

