class AnimatedBackdrop {
  constructor(options = {}) {
    this.config = {
      sectionSelector: "section",
      backdropSelector: ".animated-backdrop",
      minSpeed: 0.1,
      maxSpeed: 0.3,
      pulseIntensity: 0.1,
      driftAmount: 5,
      radiusMultiplier: 1.5,
      targetFPS: 60,
      adaptiveQuality: true,
      respectMotionPreference: true,
      ...options,
    }

    this.state = {
      width: 0,
      height: 0,
      dpr: window.devicePixelRatio || 1,
      sections: [],
      animationFrame: null,
      lastTime: 0,
      frameCount: 0,
      lastFPSCheck: 0,
      currentFPS: 60,
      qualityScale: 1,
      isVisible: true,
      isReducedMotion: false,
    }

    this.canvas = null
    this.ctx = null
    this.backdrop = null
    this.resizeTimeout = null
    this.observer = null
    this.intersectionObserver = null

    this.init()
  }

  init() {
    try {
      this.checkMotionPreference()
      this.setupCanvas()
      this.setupEventListeners()
      this.setupIntersectionObserver()
      this.resizeCanvas()
      this.initSections()
      this.startAnimation()
    } catch (error) {
      console.error("Failed to initialize AnimatedBackdrop:", error)
    }
  }

  checkMotionPreference() {
    if (this.config.respectMotionPreference) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      this.state.isReducedMotion = mediaQuery.matches

      mediaQuery.addEventListener("change", (e) => {
        this.state.isReducedMotion = e.matches
        if (e.matches) {
          this.stopAnimation()
        } else {
          this.startAnimation()
        }
      })
    }
  }

  setupCanvas() {
    this.backdrop = document.querySelector(this.config.backdropSelector)
    if (!this.backdrop) {
      throw new Error(`Backdrop element not found: ${this.config.backdropSelector}`)
    }

    this.canvas = document.createElement("canvas")
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: -1;
    `

    this.backdrop.appendChild(this.canvas)
    this.ctx = this.canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      powerPreference: "high-performance",
    })

    if (!this.ctx) {
      throw new Error("Failed to get 2D context")
    }
  }

  setupEventListeners() {
    const handleResize = this.debounce(() => {
      this.resizeCanvas()
      this.initSections()
    }, 100)

    window.addEventListener("resize", handleResize, { passive: true })

    // Handle visibility changes for performance
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopAnimation()
      } else if (!this.state.isReducedMotion) {
        this.startAnimation()
      }
    })

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      this.destroy()
    })
  }

  setupIntersectionObserver() {
    // Only animate when backdrop is visible
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.state.isVisible = entry.isIntersecting
          if (!entry.isIntersecting) {
            this.stopAnimation()
          } else if (!this.state.isReducedMotion) {
            this.startAnimation()
          }
        })
      },
      { threshold: 0.1 },
    )

    this.intersectionObserver.observe(this.backdrop)

    // Watch for DOM changes
    this.observer = new MutationObserver(
      this.debounce(() => {
        this.initSections()
      }, 250),
    )

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    })
  }

  resizeCanvas() {
    const rect = this.backdrop.getBoundingClientRect()
    this.state.width = rect.width
    this.state.height = rect.height

    const scaledWidth = this.state.width * this.state.dpr * this.state.qualityScale
    const scaledHeight = this.state.height * this.state.dpr * this.state.qualityScale

    this.canvas.width = scaledWidth
    this.canvas.height = scaledHeight
    this.canvas.style.width = `${this.state.width}px`
    this.canvas.style.height = `${this.state.height}px`

    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(this.state.dpr * this.state.qualityScale, this.state.dpr * this.state.qualityScale)
  }

  initSections() {
    this.state.sections = []
    const sections = document.querySelectorAll(this.config.sectionSelector)

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect()
      const backdropRect = this.backdrop.getBoundingClientRect()

      // Calculate position relative to backdrop
      const x = rect.left - backdropRect.left + rect.width / 2
      const y = rect.top - backdropRect.top + rect.height / 2

      this.state.sections.push({
        id: index,
        x,
        y,
        width: rect.width,
        height: rect.height,
        progress: Math.random(),
        speed: this.config.minSpeed + Math.random() * (this.config.maxSpeed - this.config.minSpeed),
        hueOffset: Math.random() * 360,
        phaseOffset: Math.random() * Math.PI * 2,
      })
    })
  }

  animate(currentTime) {
    if (!this.state.isVisible || this.state.isReducedMotion) {
      return
    }

    const deltaTime = Math.min((currentTime - this.state.lastTime) / 1000, 1 / 30) // Cap at 30fps minimum
    this.state.lastTime = currentTime

    // FPS monitoring and adaptive quality
    if (this.config.adaptiveQuality) {
      this.updateFPS(currentTime)
      this.adjustQuality()
    }

    this.render(currentTime, deltaTime)

    this.state.animationFrame = requestAnimationFrame((time) => this.animate(time))
  }

  updateFPS(currentTime) {
    this.state.frameCount++

    if (currentTime - this.state.lastFPSCheck >= 1000) {
      this.state.currentFPS = this.state.frameCount
      this.state.frameCount = 0
      this.state.lastFPSCheck = currentTime
    }
  }

  adjustQuality() {
    const targetFPS = this.config.targetFPS
    const currentFPS = this.state.currentFPS

    if (currentFPS < targetFPS * 0.8 && this.state.qualityScale > 0.5) {
      this.state.qualityScale = Math.max(0.5, this.state.qualityScale - 0.1)
      this.resizeCanvas()
    } else if (currentFPS > targetFPS * 0.95 && this.state.qualityScale < 1) {
      this.state.qualityScale = Math.min(1, this.state.qualityScale + 0.05)
      this.resizeCanvas()
    }
  }

  render(currentTime, deltaTime) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.state.width, this.state.height)

    // Background gradient
    this.renderBackground()

    // Set blend mode for glowing effect
    this.ctx.globalCompositeOperation = "lighter"

    // Render sections
    this.state.sections.forEach((section) => {
      this.renderSection(section, currentTime, deltaTime)
    })

    // Reset blend mode
    this.ctx.globalCompositeOperation = "source-over"
  }

  renderBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.state.height)
    gradient.addColorStop(0, "rgba(5, 15, 25, 0.95)") // Dark blue-teal
    gradient.addColorStop(0.5, "rgba(8, 20, 30, 0.97)") // Deeper blue-teal
    gradient.addColorStop(1, "rgba(10, 25, 35, 0.98)") // Darkest blue-teal

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.state.width, this.state.height)
  }

  renderSection(section, currentTime, deltaTime) {
    // Update section progress
    section.progress += deltaTime * section.speed
    if (section.progress > 1) section.progress -= 1

    // Calculate animation values
    const timeInSeconds = currentTime / 1000

    // Use teal/blue color range instead of full hue spectrum
    const blueHue = 200 // Base blue hue
    const tealHue = 180 // Teal hue
    const hueRange = 40 // Range between teal and blue
    const hue = tealHue + (Math.sin(section.progress * Math.PI * 2) * 0.5 + 0.5) * hueRange

    const pulse = Math.sin(section.progress * Math.PI * 2) * 0.5 + 0.5
    const radius = Math.max(section.width, section.height) * this.config.radiusMultiplier

    // Smooth drift animation
    const driftX = Math.sin(timeInSeconds * 0.5 + section.phaseOffset) * this.config.driftAmount
    const driftY = Math.cos(timeInSeconds * 0.3 + section.phaseOffset) * this.config.driftAmount

    const centerX = section.x + driftX
    const centerY = section.y + driftY

    // Create radial gradient with teal/blue colors
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)

    const intensity = this.config.pulseIntensity * pulse
    const saturation = 70 + pulse * 30 // Vary saturation for more depth
    const lightness = 50 + pulse * 20 // Vary lightness for glow effect

    gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${intensity})`)
    gradient.addColorStop(0.3, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, ${intensity * 0.7})`)
    gradient.addColorStop(0.6, `hsla(${hue}, ${saturation - 20}%, ${lightness - 20}%, ${intensity * 0.3})`)
    gradient.addColorStop(1, `hsla(${hue}, ${saturation - 30}%, ${lightness - 30}%, 0)`)

    // Draw the glow
    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    this.ctx.fill()
  }

  startAnimation() {
    if (!this.state.animationFrame && !this.state.isReducedMotion && this.state.isVisible) {
      this.state.lastTime = performance.now()
      this.animate(this.state.lastTime)
    }
  }

  stopAnimation() {
    if (this.state.animationFrame) {
      cancelAnimationFrame(this.state.animationFrame)
      this.state.animationFrame = null
    }
  }

  // Utility methods
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Public API methods
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    this.initSections()
  }

  pause() {
    this.stopAnimation()
  }

  resume() {
    if (!this.state.isReducedMotion) {
      this.startAnimation()
    }
  }

  destroy() {
    this.stopAnimation()

    if (this.observer) {
      this.observer.disconnect()
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas)
    }

    // Clear references
    this.canvas = null
    this.ctx = null
    this.backdrop = null
  }

  // Getter for performance stats
  getStats() {
    return {
      fps: this.state.currentFPS,
      qualityScale: this.state.qualityScale,
      sectionsCount: this.state.sections.length,
      isVisible: this.state.isVisible,
      isReducedMotion: this.state.isReducedMotion,
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Check if backdrop element exists
  if (document.querySelector(".animated-backdrop")) {
    window.animatedBackdrop = new AnimatedBackdrop({
      // Custom configuration can be passed here
      pulseIntensity: 0.15,
      driftAmount: 8,
      adaptiveQuality: true,
      respectMotionPreference: true,
    })
  }
})

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnimatedBackdrop
}
