document.addEventListener("DOMContentLoaded", () => {
    // Create cursor elements
    const cursorDot = document.createElement("div");
    const cursorRing = document.createElement("div");
    
    // Add classes to cursor elements
    cursorDot.classList.add("cursor-dot");
    cursorRing.classList.add("cursor-ring");
    
    // Append cursor elements to the body
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    
    // Set initial position off-screen
    let cursorVisible = false;
    let cursorEnlarged = false;
    
    // Position variables
    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    
    // Animation frame
    let requestId = null;
    
    // Mouse move event
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!cursorVisible) {
        cursorVisible = true;
        cursorDot.style.opacity = 1;
        cursorRing.style.opacity = 1;
        
        // Start animation loop
        animateCursor();
      }
    });
    
    // Animation loop
    const animateCursor = () => {
      // Calculate smooth movement with easing
      dotX += (mouseX - dotX) * 0.2;
      dotY += (mouseY - dotY) * 0.2;
      
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      // Apply positions
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      
      // Continue animation
      requestId = requestAnimationFrame(animateCursor);
    };
    
    // Mouse leave event
    document.addEventListener("mouseleave", () => {
      cursorVisible = false;
      cursorDot.style.opacity = 0;
      cursorRing.style.opacity = 0;
      cancelAnimationFrame(requestId);
    });
    
    // Mouse enter event
    document.addEventListener("mouseenter", () => {
      cursorVisible = true;
      cursorDot.style.opacity = 1;
      cursorRing.style.opacity = 1;
      animateCursor();
    });
    
    // Mouse down event
    document.addEventListener("mousedown", () => {
      cursorDot.classList.add("cursor-active");
      cursorRing.classList.add("cursor-active");
    });
    
    // Mouse up event
    document.addEventListener("mouseup", () => {
      cursorDot.classList.remove("cursor-active");
      cursorRing.classList.remove("cursor-active");
    });
    
    // Hover effect for interactive elements
    const handleHover = () => {
      if (!cursorEnlarged) {
        cursorEnlarged = true;
        cursorDot.classList.add("cursor-hover");
        cursorRing.classList.add("cursor-hover");
      }
    };
    
    const handleUnhover = () => {
      if (cursorEnlarged) {
        cursorEnlarged = false;
        cursorDot.classList.remove("cursor-hover");
        cursorRing.classList.remove("cursor-hover");
      }
    };
    
    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, .button, .project, .portfolio-item, [role="button"]'
    );
    
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseover", handleHover);
      el.addEventListener("mouseout", handleUnhover);
    });
    
    // Add text hover effect
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    
    textElements.forEach((el) => {
      el.addEventListener("mouseover", () => {
        cursorRing.classList.add("cursor-text");
      });
      
      el.addEventListener("mouseout", () => {
        cursorRing.classList.remove("cursor-text");
      });
    });
  });
  