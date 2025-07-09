document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.querySelector('.animated-backdrop');
  const canvas = document.createElement('canvas');
  backdrop.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  // Track sections
  const sections = [];
  let animationFrame;
  
  // Initialize sections
  function initSections() {
    sections.length = 0; // Clear existing sections
    
    // Get all sections
    document.querySelectorAll('section').forEach(section => {
      const rect = section.getBoundingClientRect();
      sections.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        progress: Math.random(), // Random start position
        speed: 0.0005 + Math.random() * 0.0005 // Random speed
      });
    });
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Add subtle background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(10, 10, 10, 0.95)');
    bgGradient.addColorStop(1, 'rgba(10, 10, 10, 0.98)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw sections
    sections.forEach(section => {
      section.progress += section.speed;
      if (section.progress > 1) section.progress = 0;
      
      const gradient = ctx.createRadialGradient(
        section.x, section.y, 0,
        section.x, section.y, section.width * 1.5
      );
      
      // Create pulsing effect
      const pulse = Math.sin(section.progress * Math.PI * 2) * 0.5 + 0.5;
      
      gradient.addColorStop(0, `hsla(190, 100%, 50%, ${0.1 * pulse})`);
      gradient.addColorStop(0.5, `hsla(190, 100%, 50%, ${0.05 * pulse})`);
      gradient.addColorStop(1, 'hsla(190, 100%, 50%, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(section.x, section.y, section.width * 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  // Handle window resize
  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initSections();
  }
  
  // Initialize and start animation
  initSections();
  animate();
  
  // Event listeners
  window.addEventListener('resize', handleResize);
  
  // Update sections when content changes
  const observer = new MutationObserver(() => {
    initSections();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}); 
