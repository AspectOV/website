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

  // Current cursor style
  let currentStyle = "default"

  // Define cursor styles
  const cursorStyles = {
    // Default style (blue accent)
    default: {
      dot: {
        width: "8px",
        height: "8px",
        backgroundColor: "var(--color-accent)",
        borderRadius: "50%",
        boxShadow: "0 0 10px rgba(90, 90, 255, 0.5)",
      },
      ring: {
        width: "40px",
        height: "40px",
        border: "2px solid rgba(90, 90, 255, 0.5)",
        borderRadius: "50%",
      },
      hover: {
        dot: {
          backgroundColor: "var(--color-accent-hover)",
          boxShadow: "0 0 15px rgba(122, 122, 255, 0.7)",
        },
        ring: {
          width: "50px",
          height: "50px",
          borderColor: "var(--color-accent-hover)",
          borderWidth: "1px",
        },
      },
      active: {
        dot: {
          backgroundColor: "white",
        },
        ring: {
          width: "30px",
          height: "30px",
          borderColor: "white",
          borderWidth: "3px",
        },
      },
    },
    // Neon green style
    neon: {
      dot: {
        width: "6px",
        height: "6px",
        backgroundColor: "#39FF14",
        borderRadius: "50%",
        boxShadow: "0 0 15px rgba(57, 255, 20, 0.7)",
      },
      ring: {
        width: "35px",
        height: "35px",
        border: "2px solid rgba(57, 255, 20, 0.5)",
        borderRadius: "50%",
      },
      hover: {
        dot: {
          backgroundColor: "#5FFF44",
          boxShadow: "0 0 20px rgba(95, 255, 68, 0.8)",
        },
        ring: {
          width: "45px",
          height: "45px",
          borderColor: "rgba(57, 255, 20, 0.7)",
          borderWidth: "1px",
        },
      },
      active: {
        dot: {
          backgroundColor: "white",
        },
        ring: {
          width: "25px",
          height: "25px",
          borderColor: "#39FF14",
          borderWidth: "3px",
        },
      },
    },
    // Minimal style
    minimal: {
      dot: {
        width: "4px",
        height: "4px",
        backgroundColor: "white",
        borderRadius: "50%",
        boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
      },
      ring: {
        width: "30px",
        height: "30px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "50%",
      },
      hover: {
        dot: {
          backgroundColor: "white",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.7)",
        },
        ring: {
          width: "40px",
          height: "40px",
          borderColor: "rgba(255, 255, 255, 0.5)",
        },
      },
      active: {
        dot: {
          backgroundColor: "white",
        },
        ring: {
          width: "20px",
          height: "20px",
          borderColor: "white",
          borderWidth: "2px",
        },
      },
    },
    // Square style
    square: {
      dot: {
        width: "8px",
        height: "8px",
        backgroundColor: "#FF5555",
        borderRadius: "0",
        boxShadow: "0 0 10px rgba(255, 85, 85, 0.5)",
      },
      ring: {
        width: "35px",
        height: "35px",
        border: "2px solid rgba(255, 85, 85, 0.5)",
        borderRadius: "0",
      },
      hover: {
        dot: {
          backgroundColor: "#FF7777",
          boxShadow: "0 0 15px rgba(255, 119, 119, 0.7)",
        },
        ring: {
          width: "45px",
          height: "45px",
          borderColor: "rgba(255, 85, 85, 0.7)",
          transform: "translate(-50%, -50%) rotate(45deg)",
        },
      },
      active: {
        dot: {
          backgroundColor: "white",
          transform: "translate(-50%, -50%) rotate(45deg)",
        },
        ring: {
          width: "25px",
          height: "25px",
          borderColor: "#FF5555",
          borderWidth: "3px",
        },
      },
    },
    // Gradient style
    gradient: {
      dot: {
        width: "10px",
        height: "10px",
        background: "linear-gradient(45deg, #FF3366, #FF9933)",
        borderRadius: "50%",
        boxShadow: "0 0 12px rgba(255, 51, 102, 0.6)",
      },
      ring: {
        width: "40px",
        height: "40px",
        border: "none",
        borderRadius: "50%",
        background: "linear-gradient(45deg, rgba(255, 51, 102, 0.2), rgba(255, 153, 51, 0.2))",
        boxShadow: "0 0 0 1px rgba(255, 51, 102, 0.3)",
      },
      hover: {
        dot: {
          background: "linear-gradient(45deg, #FF5588, #FFBB55)",
          boxShadow: "0 0 18px rgba(255, 85, 136, 0.7)",
        },
        ring: {
          width: "50px",
          height: "50px",
          background: "linear-gradient(45deg, rgba(255, 51, 102, 0.3), rgba(255, 153, 51, 0.3))",
        },
      },
      active: {
        dot: {
          background: "white",
        },
        ring: {
          width: "30px",
          height: "30px",
          background: "linear-gradient(45deg, rgba(255, 51, 102, 0.5), rgba(255, 153, 51, 0.5))",
        },
      },
    },
  }

  // Function to apply cursor style
  const applyCursorStyle = (style) => {
    if (!cursorStyles[style]) {
      console.error(`Cursor style "${style}" not found`)
      return
    }

    currentStyle = style
    const styleObj = cursorStyles[style]

    // Apply dot styles
    Object.keys(styleObj.dot).forEach((prop) => {
      cursorDot.style[prop] = styleObj.dot[prop]
    })

    // Apply ring styles
    Object.keys(styleObj.ring).forEach((prop) => {
      cursorRing.style[prop] = styleObj.ring[prop]
    })

    // Reset any transform classes
    cursorDot.className = "cursor-dot"
    cursorRing.className = "cursor-ring"

    // Add current style class
    cursorDot.classList.add(`cursor-${style}`)
    cursorRing.classList.add(`cursor-${style}`)
  }

  // Public function to change cursor style
  window.changeCursorStyle = (style) => {
    applyCursorStyle(style)
  }

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
    // Apply active styles
    const activeStyles = cursorStyles[currentStyle].active

    // Apply dot active styles
    Object.keys(activeStyles.dot).forEach((prop) => {
      cursorDot.style[prop] = activeStyles.dot[prop]
    })

    // Apply ring active styles
    Object.keys(activeStyles.ring).forEach((prop) => {
      cursorRing.style[prop] = activeStyles.ring[prop]
    })

    cursorDot.classList.add("cursor-active")
    cursorRing.classList.add("cursor-active")
  })

  // Mouse up event
  document.addEventListener("mouseup", () => {
    // Reapply current style to reset from active state
    applyCursorStyle(currentStyle)

    cursorDot.classList.remove("cursor-active")
    cursorRing.classList.remove("cursor-active")
  })

  // Hover effect for interactive elements
  const handleHover = () => {
    // Apply hover styles
    const hoverStyles = cursorStyles[currentStyle].hover

    // Apply dot hover styles
    Object.keys(hoverStyles.dot).forEach((prop) => {
      cursorDot.style[prop] = hoverStyles.dot[prop]
    })

    // Apply ring hover styles
    Object.keys(hoverStyles.ring).forEach((prop) => {
      cursorRing.style[prop] = hoverStyles.ring[prop]
    })

    cursorDot.classList.add("cursor-hover")
    cursorRing.classList.add("cursor-hover")
  }

  const handleUnhover = () => {
    // Reapply current style to reset from hover state
    applyCursorStyle(currentStyle)

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
        // Reapply current style
        applyCursorStyle(currentStyle)
      })
    })

    // Add data-cursor attribute support
    const customCursorElements = document.querySelectorAll("[data-cursor]")
    customCursorElements.forEach((el) => {
      const cursorType = el.getAttribute("data-cursor")
      if (cursorStyles[cursorType]) {
        el.addEventListener("mouseover", () => {
          applyCursorStyle(cursorType)
        })

        el.addEventListener("mouseout", () => {
          applyCursorStyle("default")
        })
      }
    })
  }

  // Force dark background on all elements
  const forceDarkBackground = () => {
    // Apply to all list elements
    const listElements = document.querySelectorAll("ul, ol, li")
    listElements.forEach((el) => {
      el.style.backgroundColor = "transparent"
    })
  }

  // Run initially and on scroll
  forceDarkBackground()
  window.addEventListener("scroll", forceDarkBackground)

  // Initial setup
  applyCursorStyle("default")
  addInteractiveListeners()

  // Re-add listeners when DOM changes (for dynamic content)
  const observer = new MutationObserver(() => {
    addInteractiveListeners()
    forceDarkBackground()
  })
  observer.observe(document.body, { childList: true, subtree: true })
})
