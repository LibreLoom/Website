import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/Navigation.css'
import Settings from './Settings'

function Navigation({ disableSnapDragging, setDisableSnapDragging }) {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [showSettings, setShowSettings] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  // Draggable hamburger state
  const [position, setPosition] = useState({ x: null, y: null })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hasMoved, setHasMoved] = useState(false)
  const hamburgerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const animationFrameRef = useRef(null)
  const pendingPositionRef = useRef(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    
    // Apply saved custom colors if they exist
    applySavedColors(savedTheme)
    
    // Initialize hamburger position from localStorage or default to bottom-right
    const savedPosition = localStorage.getItem('hamburgerPosition')
    if (savedPosition) {
      const parsed = JSON.parse(savedPosition)
      const buttonSize = 60
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      // Validate that the saved position is within viewport bounds
      // If not, reset to default bottom-right corner
      if (
        parsed.x !== null && 
        parsed.y !== null &&
        parsed.x >= 0 && 
        parsed.x <= windowWidth - buttonSize &&
        parsed.y >= 0 && 
        parsed.y <= windowHeight - buttonSize
      ) {
        setPosition(parsed)
      } else {
        // Position is invalid (outside viewport), clear it and use CSS default
        localStorage.removeItem('hamburgerPosition')
        setPosition({ x: null, y: null })
      }
    }
    
    // Trigger animation on initial mount
    requestAnimationFrame(() => {
      setShouldAnimate(true)
    })
  }, [])

  const applySavedColors = (currentTheme) => {
    const savedColors = localStorage.getItem('customColors')
    const useDarkModePalette = localStorage.getItem('useDarkModePalette') === 'true'
    
    if (savedColors) {
      const colors = JSON.parse(savedColors)
      const root = document.documentElement
      
      if (useDarkModePalette) {
        root.style.setProperty('--primary-light', colors.primary)
        root.style.setProperty('--secondary-light', colors.secondary)
        root.style.setProperty('--accent-light', colors.accent)
        root.style.setProperty('--primary-dark', colors.primaryDark)
        root.style.setProperty('--secondary-dark', colors.secondaryDark)
        root.style.setProperty('--accent-dark', colors.accentDark)
        
        if (currentTheme === 'dark') {
          root.style.setProperty('--primary', colors.primaryDark)
          root.style.setProperty('--secondary', colors.secondaryDark)
          root.style.setProperty('--accent', colors.accentDark)
        } else {
          root.style.setProperty('--primary', colors.primary)
          root.style.setProperty('--secondary', colors.secondary)
          root.style.setProperty('--accent', colors.accent)
        }
      } else {
        // Swap primary and secondary for dark mode, keep accent the same
        root.style.setProperty('--primary-light', colors.primary)
        root.style.setProperty('--secondary-light', colors.secondary)
        root.style.setProperty('--accent-light', colors.accent)
        root.style.setProperty('--primary-dark', colors.secondary)
        root.style.setProperty('--secondary-dark', colors.primary)
        root.style.setProperty('--accent-dark', colors.accent)
        
        if (currentTheme === 'dark') {
          root.style.setProperty('--primary', colors.secondary)
          root.style.setProperty('--secondary', colors.primary)
          root.style.setProperty('--accent', colors.accent)
        } else {
          root.style.setProperty('--primary', colors.primary)
          root.style.setProperty('--secondary', colors.secondary)
          root.style.setProperty('--accent', colors.accent)
        }
      }
    }
  }

  // Close menu when screen size changes to desktop and validate position on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
      
      // Validate hamburger position is still within viewport bounds
      if (position.x !== null && position.y !== null) {
        const buttonSize = 60
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        
        // Check if current position is now outside viewport
        if (
          position.x < 0 || 
          position.x > windowWidth - buttonSize ||
          position.y < 0 || 
          position.y > windowHeight - buttonSize
        ) {
          // Reset to default position (bottom-right)
          localStorage.removeItem('hamburgerPosition')
          setPosition({ x: null, y: null })
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [position])

  // Close menu when route changes and disable animation after initial mount
  useEffect(() => {
    setIsMenuOpen(false)
    
    // After the first navigation (not initial mount), disable animation
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      setShouldAnimate(false)
    }
  }, [location])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    requestAnimationFrame(() => {
      if (mobileMenuRef.current) {
        mobileMenuRef.current.focus()
      }
    })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    applySavedColors(newTheme)
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  const closeSettings = () => {
    setShowSettings(false)
  }

  // Dragging handlers for hamburger menu on mobile
  const handleDragStart = (e) => {
    if (window.innerWidth > 768) return // Only on mobile
    
    e.preventDefault() // Prevent any default behavior
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
    
    // Get actual current position if not set yet
    let currentX = position.x
    let currentY = position.y
    
    if (currentX === null || currentY === null) {
      const rect = hamburgerRef.current.getBoundingClientRect()
      currentX = rect.left
      currentY = rect.top
    }
    
    // Set all states together to avoid partial updates
    setIsDragging(true)
    setHasMoved(false) // Reset movement tracking
    setPosition({ x: currentX, y: currentY })
    setDragStart({
      x: clientX - currentX,
      y: clientY - currentY
    })
  }

  const handleDrag = (e) => {
    if (!isDragging || window.innerWidth > 768) return
    
    e.preventDefault()
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
    
    // Calculate new position
    let newX = clientX - dragStart.x
    let newY = clientY - dragStart.y
    
    // Check if moved beyond threshold (5 pixels)
    const moveThreshold = 5
    const deltaX = Math.abs(newX - position.x)
    const deltaY = Math.abs(newY - position.y)
    
    if (!hasMoved && (deltaX > moveThreshold || deltaY > moveThreshold)) {
      setHasMoved(true)
    }
    
    // Constrain to viewport boundaries
    const buttonSize = 60 // Width/height of the hamburger button
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    // Keep button within viewport bounds
    newX = Math.max(0, Math.min(newX, windowWidth - buttonSize))
    newY = Math.max(0, Math.min(newY, windowHeight - buttonSize))
    
    // Store the pending position
    pendingPositionRef.current = {
      x: newX,
      y: newY
    }
    
    // Use requestAnimationFrame for smooth updates
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        if (pendingPositionRef.current) {
          setPosition(pendingPositionRef.current)
          pendingPositionRef.current = null
        }
        animationFrameRef.current = null
      })
    }
  }

  const handleDragEnd = (e) => {
    if (!isDragging || window.innerWidth > 768) return
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    setIsDragging(false)
    
    let finalPosition
    
    // Snap to nearest corner with smooth animation
    if (!disableSnapDragging){
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const snapMargin = 20
      
      // Determine which corner to snap to
      const currentX = position.x !== null ? position.x : windowWidth - 80
      const currentY = position.y !== null ? position.y : windowHeight - 80
      
      let newX, newY
      
      // Snap horizontally
      if (currentX < windowWidth / 2) {
        newX = snapMargin
      } else {
        newX = windowWidth - 80 // 60px button + margin
      }
      
      // Snap vertically
      if (currentY < windowHeight / 2) {
        newY = snapMargin
      } else {
        newY = windowHeight - 80
      }
      
      finalPosition = { x: newX, y: newY }
    } else {
      // If snap dragging is disabled, keep current position
      finalPosition = { x: position.x, y: position.y }
    }
    
    setPosition(finalPosition)
    localStorage.setItem('hamburgerPosition', JSON.stringify(finalPosition))
  }

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDrag(e)
      const handleMouseUp = (e) => handleDragEnd(e)
      const handleTouchMove = (e) => handleDrag(e)
      const handleTouchEnd = (e) => handleDragEnd(e)
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, position, dragStart])

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Calculate hamburger button position style
  const getHamburgerStyle = () => {
    // Only apply custom positioning if a position has been set
    // Let CSS handle the default positioning via media queries
    if (position.x === null || position.y === null) {
      return {}
    }
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      right: 'auto',
      bottom: 'auto'
    }
  }

  return (
    <>
      <nav className="navigation" aria-label="Primary">
        <div className={`nav-container ${shouldAnimate ? 'animate' : ''}`}>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={theme === 'dark'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>

          <button
            className="theme-toggle settings-btn"
            type="button"
            onClick={openSettings}
            aria-label="Open settings"
            aria-haspopup="dialog"
          >
            <span>
              <svg width="1.3em" height="1.3em" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M 29.054688 10 C 27.715688 10 26.571703 10.964203 26.345703 12.283203 L 25.763672 15.664062 C 25.457672 15.781062 25.152469 15.902156 24.855469 16.035156 L 22.058594 14.058594 C 20.830594 13.209594 19.383344 13.520328 18.527344 14.361328 L 14.361328 18.525391 C 13.414328 19.472391 13.288547 20.962641 14.060547 22.056641 L 16.035156 24.855469 C 15.901156 25.152469 15.781063 25.455719 15.664062 25.761719 L 12.283203 26.34375 C 10.963203 26.57075 10 27.715688 10 29.054688 L 10 34.945312 C 10 36.284312 10.964203 37.428297 12.283203 37.654297 L 15.664062 38.236328 C 15.781062 38.542328 15.902156 38.847531 16.035156 39.144531 L 14.058594 41.941406 C 13.286594 43.034406 13.414328 44.525656 14.361328 45.472656 L 18.525391 49.638672 C 19.609391 50.698672 21.124641 50.614453 22.056641 49.939453 L 24.855469 47.964844 C 25.152469 48.098844 25.455719 48.218938 25.761719 48.335938 L 26.34375 51.716797 C 26.57075 53.036797 27.715688 54 29.054688 54 L 34.945312 54 C 36.284312 54 37.428297 53.035797 37.654297 51.716797 L 38.236328 48.335938 C 38.542328 48.218937 38.847531 48.097844 39.144531 47.964844 L 41.941406 49.941406 C 42.766406 50.549406 44.343656 50.768672 45.472656 49.638672 L 49.638672 45.474609 C 50.585672 44.527609 50.711453 43.037359 49.939453 41.943359 L 47.964844 39.144531 C 48.098844 38.847531 48.218938 38.544281 48.335938 38.238281 L 51.716797 37.65625 C 53.036797 37.42925 54 36.284312 54 34.945312 L 54 29.054688 C 54 27.715688 53.035797 26.571703 51.716797 26.345703 L 48.335938 25.763672 C 48.218937 25.457672 48.097844 25.152469 47.964844 24.855469 L 49.941406 22.058594 C 50.713406 20.965594 50.585672 19.474344 49.638672 18.527344 L 45.474609 14.361328 C 44.417609 13.329328 42.952359 13.351547 41.943359 14.060547 L 39.144531 16.035156 C 38.847531 15.901156 38.544281 15.781063 38.238281 15.664062 L 37.65625 12.283203 C 37.42925 10.963203 36.284312 10 34.945312 10 L 29.054688 10 z M 30.214844 14 L 33.787109 14 C 33.848109 14 33.900156 14.043516 33.910156 14.103516 L 34.681641 18.589844 C 36.449641 19.224844 38.104844 19.894141 39.589844 20.619141 L 43.302734 17.996094 C 43.352734 17.961094 43.421844 17.966766 43.464844 18.009766 L 45.990234 20.537109 C 46.033234 20.580109 46.040859 20.647266 46.005859 20.697266 L 43.380859 24.412109 C 44.139859 26.017109 44.824156 27.649359 45.410156 29.318359 L 49.896484 30.091797 C 49.956484 30.101797 50 30.153844 50 30.214844 L 50 33.787109 C 50 33.848109 49.955531 33.900156 49.894531 33.910156 L 45.410156 34.681641 C 44.825156 36.350641 44.148859 37.985844 43.380859 39.589844 L 46.005859 43.304688 C 46.040859 43.354688 46.033234 43.421844 45.990234 43.464844 L 43.464844 45.992188 C 43.421844 46.035187 43.352734 46.040859 43.302734 46.005859 L 39.589844 43.382812 C 37.949844 44.153812 36.313641 44.829109 34.681641 45.412109 L 33.908203 49.896484 C 33.898203 49.956484 33.846156 50 33.785156 50 L 30.212891 50 C 30.151891 50 30.099844 49.955531 30.089844 49.894531 L 29.318359 45.410156 C 27.709359 44.851156 26.075156 44.184859 24.410156 43.380859 L 20.695312 46.005859 C 20.645312 46.040859 20.578156 46.033234 20.535156 45.990234 L 18.007812 43.464844 C 17.964813 43.421844 17.959141 43.352734 17.994141 43.302734 L 20.617188 39.589844 C 19.838187 37.924844 19.161891 36.288641 18.587891 34.681641 L 14.103516 33.908203 C 14.043516 33.898203 14 33.846156 14 33.785156 L 14 30.212891 C 14 30.151891 14.043516 30.100844 14.103516 30.089844 L 18.589844 29.316406 C 19.170844 27.680406 19.837141 26.045156 20.619141 24.410156 L 17.994141 20.695312 C 17.959141 20.645312 17.966766 20.578156 18.009766 20.535156 L 20.535156 18.007812 C 20.578156 17.964813 20.647266 17.959141 20.697266 17.994141 L 24.410156 20.617188 C 25.958156 19.874187 27.599359 19.201891 29.318359 18.587891 L 30.091797 14.103516 C 30.101797 14.043516 30.153844 14 30.214844 14 z M 32 23 C 27.029 23 23 27.029 23 32 C 23 36.971 27.029 41 32 41 C 36.971 41 41 36.971 41 32 C 41 27.029 36.971 23 32 23 z M 32 27 C 34.761 27 37 29.239 37 32 C 37 34.761 34.761 37 32 37 C 29.239 37 27 34.761 27 32 C 27 29.239 29.239 27 32 27 z"></path>
              </svg>
            </span>
          </button>
          
          <div className="nav-divider"></div>
          
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            Home
          </Link>
          
          <Link
            to="/projects"
            className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
            aria-current={location.pathname === '/projects' ? 'page' : undefined}
          >
            Projects
          </Link>
          
          <Link
            to="/team"
            className={`nav-link ${location.pathname === '/team' ? 'active' : ''}`}
            aria-current={location.pathname === '/team' ? 'page' : undefined}
          >
            Team
          </Link>

          <Link
            to="/sponsors"
            className={`nav-link ${location.pathname === '/sponsors' ? 'active' : ''}`}
            aria-current={location.pathname === '/sponsors' ? 'page' : undefined}
          >
            Sponsors
          </Link>

          <div className="nav-divider"></div>
          
          <a href="https://ko-fi.com/libreloom" target="_blank" rel="noopener noreferrer" className="nav-link donate-btn">
            ☕ Support Us
          </a>
        </div>
      </nav>

      {/* Mobile Hamburger Menu */}
      <button
        ref={hamburgerRef}
        className={`hamburger ${isMenuOpen ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
        type="button"
        onClick={() => !hasMoved && setIsMenuOpen(!isMenuOpen)}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={getHamburgerStyle()}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div
            className="mobile-menu"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            ref={mobileMenuRef}
            tabIndex="-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={theme === 'dark'}
            >
              <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            </button>

            <button
              className="theme-toggle settings-btn"
              type="button"
              onClick={openSettings}
              aria-label="Open settings"
              aria-haspopup="dialog"
            >
              <span>
                <svg width="1.3em" height="1.3em" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M 29.054688 10 C 27.715688 10 26.571703 10.964203 26.345703 12.283203 L 25.763672 15.664062 C 25.457672 15.781062 25.152469 15.902156 24.855469 16.035156 L 22.058594 14.058594 C 20.830594 13.209594 19.383344 13.520328 18.527344 14.361328 L 14.361328 18.525391 C 13.414328 19.472391 13.288547 20.962641 14.060547 22.056641 L 16.035156 24.855469 C 15.901156 25.152469 15.781063 25.455719 15.664062 25.761719 L 12.283203 26.34375 C 10.963203 26.57075 10 27.715688 10 29.054688 L 10 34.945312 C 10 36.284312 10.964203 37.428297 12.283203 37.654297 L 15.664062 38.236328 C 15.781062 38.542328 15.902156 38.847531 16.035156 39.144531 L 14.058594 41.941406 C 13.286594 43.034406 13.414328 44.525656 14.361328 45.472656 L 18.525391 49.638672 C 19.609391 50.698672 21.124641 50.614453 22.056641 49.939453 L 24.855469 47.964844 C 25.152469 48.098844 25.455719 48.218938 25.761719 48.335938 L 26.34375 51.716797 C 26.57075 53.036797 27.715688 54 29.054688 54 L 34.945312 54 C 36.284312 54 37.428297 53.035797 37.654297 51.716797 L 38.236328 48.335938 C 38.542328 48.218937 38.847531 48.097844 39.144531 47.964844 L 41.941406 49.941406 C 42.766406 50.549406 44.343656 50.768672 45.472656 49.638672 L 49.638672 45.474609 C 50.585672 44.527609 50.711453 43.037359 49.939453 41.943359 L 47.964844 39.144531 C 48.098844 38.847531 48.218938 38.544281 48.335938 38.238281 L 51.716797 37.65625 C 53.036797 37.42925 54 36.284312 54 34.945312 L 54 29.054688 C 54 27.715688 53.035797 26.571703 51.716797 26.345703 L 48.335938 25.763672 C 48.218937 25.457672 48.097844 25.152469 47.964844 24.855469 L 49.941406 22.058594 C 50.713406 20.965594 50.585672 19.474344 49.638672 18.527344 L 45.474609 14.361328 C 44.417609 13.329328 42.952359 13.351547 41.943359 14.060547 L 39.144531 16.035156 C 38.847531 15.901156 38.544281 15.781063 38.238281 15.664062 L 37.65625 12.283203 C 37.42925 10.963203 36.284312 10 34.945312 10 L 29.054688 10 z M 30.214844 14 L 33.787109 14 C 33.848109 14 33.900156 14.043516 33.910156 14.103516 L 34.681641 18.589844 C 36.449641 19.224844 38.104844 19.894141 39.589844 20.619141 L 43.302734 17.996094 C 43.352734 17.961094 43.421844 17.966766 43.464844 18.009766 L 45.990234 20.537109 C 46.033234 20.580109 46.040859 20.647266 46.005859 20.697266 L 43.380859 24.412109 C 44.139859 26.017109 44.824156 27.649359 45.410156 29.318359 L 49.896484 30.091797 C 49.956484 30.101797 50 30.153844 50 30.214844 L 50 33.787109 C 50 33.848109 49.955531 33.900156 49.894531 33.910156 L 45.410156 34.681641 C 44.825156 36.350641 44.148859 37.985844 43.380859 39.589844 L 46.005859 43.304688 C 46.040859 43.354688 46.033234 43.421844 45.990234 43.464844 L 43.464844 45.992188 C 43.421844 46.035187 43.352734 46.040859 43.302734 46.005859 L 39.589844 43.382812 C 37.949844 44.153812 36.313641 44.829109 34.681641 45.412109 L 33.908203 49.896484 C 33.898203 49.956484 33.846156 50 33.785156 50 L 30.212891 50 C 30.151891 50 30.099844 49.955531 30.089844 49.894531 L 29.318359 45.410156 C 27.709359 44.851156 26.075156 44.184859 24.410156 43.380859 L 20.695312 46.005859 C 20.645312 46.040859 20.578156 46.033234 20.535156 45.990234 L 18.007812 43.464844 C 17.964813 43.421844 17.959141 43.352734 17.994141 43.302734 L 20.617188 39.589844 C 19.838187 37.924844 19.161891 36.288641 18.587891 34.681641 L 14.103516 33.908203 C 14.043516 33.898203 14 33.846156 14 33.785156 L 14 30.212891 C 14 30.151891 14.043516 30.100844 14.103516 30.089844 L 18.589844 29.316406 C 19.170844 27.680406 19.837141 26.045156 20.619141 24.410156 L 17.994141 20.695312 C 17.959141 20.645312 17.966766 20.578156 18.009766 20.535156 L 20.535156 18.007812 C 20.578156 17.964813 20.647266 17.959141 20.697266 17.994141 L 24.410156 20.617188 C 25.958156 19.874187 27.599359 19.201891 29.318359 18.587891 L 30.091797 14.103516 C 30.101797 14.043516 30.153844 14 30.214844 14 z M 32 23 C 27.029 23 23 27.029 23 32 C 23 36.971 27.029 41 32 41 C 36.971 41 41 36.971 41 32 C 41 27.029 36.971 23 32 23 z M 32 27 C 34.761 27 37 29.239 37 32 C 37 34.761 34.761 37 32 37 C 29.239 37 27 34.761 27 32 C 27 29.239 29.239 27 32 27 z"></path>
                </svg>
              </span>
            </button>
            
            <div className="nav-divider"></div>
            
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            
            <Link
              to="/projects"
              className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
              aria-current={location.pathname === '/projects' ? 'page' : undefined}
            >
              Projects
            </Link>
            
            <Link
              to="/team"
              className={`nav-link ${location.pathname === '/team' ? 'active' : ''}`}
              aria-current={location.pathname === '/team' ? 'page' : undefined}
            >
              Team
            </Link>

            <Link
              to="/sponsors"
              className={`nav-link ${location.pathname === '/sponsors' ? 'active' : ''}`}
              aria-current={location.pathname === '/sponsors' ? 'page' : undefined}
            >
              Sponsors
            </Link>

            <div className="nav-divider"></div>
            
            <a href="https://ko-fi.com/libreloom" target="_blank" rel="noopener noreferrer" className="nav-link donate-btn">
              ☕ Support Us
            </a>
          </div>
        </div>
      )}

      <Settings
        isOpen={showSettings}
        onClose={closeSettings}
        disableSnapDragging={disableSnapDragging}
        setDisableSnapDragging={setDisableSnapDragging}
      />
    </>
  )
}

export default Navigation
