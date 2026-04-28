import { useEffect, useState } from 'react'

function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger fade in after mount
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 150ms ease-out, transform 150ms ease-out',
      }}
    >
      {children}
    </div>
  )
}

export default PageTransition
