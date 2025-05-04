document.addEventListener("DOMContentLoaded", () => {
  // Create cursor elements
  const cursorDot = document.createElement("div")
  const cursorRing = document.createElement("div")

  // Add classes to cursor elements
  cursorDot.classList.add("cursor-dot")
  cursorRing.classList.add("cursor-ring")

  // Append cursor elements to the body
  document.body.appendChild(cursorDot)
  document.body.appendChild(cursorRing)

  // Set initial position and visibility
  cursorDot.style.opacity = 1
  cursorRing.style.opacity = 1

  // Position variables
  let mouseX = 0
  let mouseY = 0
  let dotX = 0
  let dotY = 0
  let ringX = 0
  let ringY = 0

  // Animation frame
  let requestId = null

  // Mouse move event
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    // Start animation loop if not already running
    if (!requestId) {
      animateCursor()
    }
  })

  // Animation loop
  const animateCursor = () => {
    // Calculate smooth movement with easing
    dotX += (mouseX - dotX) * 0.2
    dotY += (mouseY - dotY) * 0.2

    ringX += (mouseX - ringX) * 0.15
    ringY += (mouseY - ringY) * 0.15

    // Apply positions - both centered at the same point
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`

    // Continue animation
    requestId = requestAnimationFrame(animateCursor)
  }

  // Mouse leave event
  document.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = 0
    cursorRing.style.opacity = 0
    cancelAnimationFrame(requestId)
    requestId = null
  })

  // Mouse enter event
  document.addEventListener("mouseenter", () => {
    cursorDot.style.opacity = 1
    cursorRing.style.opacity = 1
    if (!requestId) {
      animateCursor()
    }
  })

  // Mouse down event
  document.addEventListener("mousedown", () => {
    cursorDot.classList.add("cursor-active")
    cursorRing.classList.add("cursor-active")
  })

  // Mouse up event
  document.addEventListener("mouseup", () => {
    cursorDot.classList.remove("cursor-active")
    cursorRing.classList.remove("cursor-active")
  })

  // Hover effect for interactive elements
  const handleHover = () => {
    cursorDot.classList.add("cursor-hover")
    cursorRing.classList.add("cursor-hover")
  }

  const handleUnhover = () => {
    cursorDot.classList.remove("cursor-hover")
    cursorRing.classList.remove("cursor-hover")
  }

  // Add hover listeners to interactive elements
  const addInteractiveListeners = () => {
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, .button, .project, .portfolio-item, [role="button"]',
    )

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseover", handleHover)
      el.addEventListener("mouseout", handleUnhover)
    })

    const textElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p")

    textElements.forEach((el) => {
      el.addEventListener("mouseover", () => {
        cursorRing.classList.add("cursor-text")
      })

      el.addEventListener("mouseout", () => {
        cursorRing.classList.remove("cursor-text")
      })
    })
  }

  // Initial setup
  addInteractiveListeners()

  // Re-add listeners when DOM changes (for dynamic content)
  const observer = new MutationObserver(addInteractiveListeners)
  observer.observe(document.body, { childList: true, subtree: true })
  
  // Force dark background on all elements
  const forceDarkBackground = () => {
    // Apply to all list elements
    const listElements = document.querySelectorAll('ul, ol, li')
    listElements.forEach(el => {
      el.style.backgroundColor = 'transparent'
    })
  }
  
  // Run initially and on scroll
  forceDarkBackground()
  window.addEventListener('scroll', forceDarkBackground)
})
