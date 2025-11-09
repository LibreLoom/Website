import React, { useState, useEffect } from 'react'
import '../styles/ColorSettings.css'

function ColorSettings({ isOpen, onClose }) {
  const defaultColors = {
    primary: '#FFFFFF',
    secondary: '#000000',
    accent: '#767676',
    primaryDark: '#000000',
    secondaryDark: '#FFFFFF',
    accentDark: '#767676'
  }

  const [colors, setColors] = useState(defaultColors)
  const [useDarkModePalette, setUseDarkModePalette] = useState(false)

  useEffect(() => {
    // Load saved colors from localStorage
    const savedColors = localStorage.getItem('customColors')
    const savedUseDarkMode = localStorage.getItem('useDarkModePalette')
    
    if (savedColors) {
      setColors(JSON.parse(savedColors))
    }
    
    if (savedUseDarkMode !== null) {
      setUseDarkModePalette(savedUseDarkMode === 'true')
    }
  }, [])

  const handleColorChange = (colorType, value) => {
    setColors(prev => ({
      ...prev,
      [colorType]: value
    }))
  }

  const handleApply = () => {
    // Save to localStorage
    localStorage.setItem('customColors', JSON.stringify(colors))
    localStorage.setItem('useDarkModePalette', useDarkModePalette.toString())
    
    // Apply colors to CSS variables
    applyColors()
    
    onClose()
  }

  const handleReset = () => {
    setColors(defaultColors)
    setUseDarkModePalette(false)
    
    // Remove from localStorage
    localStorage.removeItem('customColors')
    localStorage.removeItem('useDarkModePalette')
    
    // Reset CSS variables to defaults
    const root = document.documentElement
    root.style.setProperty('--primary-light', defaultColors.primary)
    root.style.setProperty('--secondary-light', defaultColors.secondary)
    root.style.setProperty('--accent-light', defaultColors.accent)
    root.style.setProperty('--primary-dark', defaultColors.primaryDark)
    root.style.setProperty('--secondary-dark', defaultColors.secondaryDark)
    root.style.setProperty('--accent-dark', defaultColors.accentDark)
    
    // Update the active theme variables
    const theme = document.documentElement.getAttribute('data-theme') || 'light'
    if (theme === 'dark') {
      root.style.setProperty('--primary', defaultColors.primaryDark)
      root.style.setProperty('--secondary', defaultColors.secondaryDark)
      root.style.setProperty('--accent', defaultColors.accentDark)
    } else {
      root.style.setProperty('--primary', defaultColors.primary)
      root.style.setProperty('--secondary', defaultColors.secondary)
      root.style.setProperty('--accent', defaultColors.accent)
    }
  }

  const applyColors = () => {
    const root = document.documentElement
    
    if (useDarkModePalette) {
      // Store both palettes
      root.style.setProperty('--primary-light', colors.primary)
      root.style.setProperty('--secondary-light', colors.secondary)
      root.style.setProperty('--accent-light', colors.accent)
      root.style.setProperty('--primary-dark', colors.primaryDark)
      root.style.setProperty('--secondary-dark', colors.secondaryDark)
      root.style.setProperty('--accent-dark', colors.accentDark)
      
      // Apply based on current theme
      const theme = document.documentElement.getAttribute('data-theme') || 'light'
      if (theme === 'dark') {
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
      
      // Apply based on current theme
      const theme = document.documentElement.getAttribute('data-theme') || 'light'
      if (theme === 'dark') {
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

  if (!isOpen) return null

  return (
    <div className="settings-overlay active" onClick={(e) => e.target.className.includes('settings-overlay') && onClose()}>
      <div className="color-settings-modal" onClick={(e) => e.stopPropagation()}>
        <h1>Color Settings</h1>
        
        <div className="color-input-group">
          <label>Primary Color (Active)</label>
          <input
            type="color"
            value={colors.primary}
            onChange={(e) => handleColorChange('primary', e.target.value)}
            className="color-input"
          />
        </div>

        <div className="color-input-group">
          <label>Secondary Color (Active)</label>
          <input
            type="color"
            value={colors.secondary}
            onChange={(e) => handleColorChange('secondary', e.target.value)}
            className="color-input"
          />
        </div>

        <div className="color-input-group">
          <label>Accent Color (Active)</label>
          <input
            type="color"
            value={colors.accent}
            onChange={(e) => handleColorChange('accent', e.target.value)}
            className="color-input"
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="darkModePalette"
            checked={useDarkModePalette}
            onChange={(e) => setUseDarkModePalette(e.target.checked)}
          />
          <label htmlFor="darkModePalette">Use different color palette for dark mode</label>
        </div>

        {useDarkModePalette && (
          <>
            <div className="color-input-group">
              <label>Primary Color (Dark Mode Only)</label>
              <input
                type="color"
                value={colors.primaryDark}
                onChange={(e) => handleColorChange('primaryDark', e.target.value)}
                className="color-input"
              />
            </div>

            <div className="color-input-group">
              <label>Secondary Color (Dark Mode Only)</label>
              <input
                type="color"
                value={colors.secondaryDark}
                onChange={(e) => handleColorChange('secondaryDark', e.target.value)}
                className="color-input"
              />
            </div>

            <div className="color-input-group">
              <label>Accent Color (Dark Mode Only)</label>
              <input
                type="color"
                value={colors.accentDark}
                onChange={(e) => handleColorChange('accentDark', e.target.value)}
                className="color-input"
              />
            </div>
          </>
        )}

        <div className="button-group">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="reset-btn" onClick={handleReset}>
            Reset Colors
          </button>
          <button className="apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default ColorSettings

