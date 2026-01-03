import React, { useEffect, useRef } from 'react'
import './Card.css'

function ModalCard({
  isOpen,
  onClose,
  title,
  titleId,
  descriptionId,
  description,
  wide = false,
  fullscreen = false,
  children
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    requestAnimationFrame(() => {
      if (modalRef.current) {
        modalRef.current.focus()
      }
    })

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const overlayClasses = [
    'modal-overlay',
    'is-open',
    fullscreen && 'modal-overlay--full'
  ].filter(Boolean).join(' ')

  const cardClasses = [
    'card',
    'card--modal',
    wide && 'card--modal--wide',
    fullscreen && 'card--modal--fullscreen'
  ].filter(Boolean).join(' ')

  return (
    <div
      className={overlayClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}
    >
      <div
        className={cardClasses}
        ref={modalRef}
        tabIndex="-1"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h1 id={titleId}>{title}</h1>}
        {description && (
          <p id={descriptionId} className="visually-hidden">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

export default ModalCard
