document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.querySelector('.animated-backdrop');
  const canvas = document.createElement('canvas');
  backdrop.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  // Particles array
  const particles = [];
  const particleCount = 30; // Reduced number of particles
  
  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 150 + 100; // Larger, more subtle particles
      this.speedX = (Math.random() - 0.5) * 0.2; // Slower movement
      this.speedY = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.15 + 0.05; // More subtle opacity
      this.hue = 190 + Math.random() * 20; // Blue hue range
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x < -this.size) this.x = width + this.size;
      if (this.x > width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = height + this.size;
      if (this.y > height + this.size) this.y = -this.size;
    }
    
    draw() {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.opacity})`);
      gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, 'hsla(190, 100%, 50%, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
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
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  // Start animation
  animate();
}); 
