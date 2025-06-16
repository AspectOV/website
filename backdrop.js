document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.querySelector('.animated-backdrop');
  const canvas = document.createElement('canvas');
  backdrop.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height, dpr = window.devicePixelRatio || 1;

  // Track sections
  const sections = [];
  let animationFrame;
  let lastTime = performance.now();

  function resizeCanvas() {
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(dpr, dpr); // Apply DPR scaling
  }

  // Initialize sections
  function initSections() {
    sections.length = 0;

    document.querySelectorAll('section').forEach(section => {
      const rect = section.getBoundingClientRect();
      sections.push({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
        width: rect.width,
        height: rect.height,
        progress: Math.random(),
        speed: 0.1 + Math.random() * 0.2 // Animation speed in Hz
      });
    });
  }

  // Animation loop
  function animate(now) {
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    const bgGradient = ctx.createLinearGradient(0, 0, 0, height / dpr);
    bgGradient.addColorStop(0, 'rgba(10, 10, 10, 0.95)');
    bgGradient.addColorStop(1, 'rgba(10, 10, 10, 0.98)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width / dpr, height / dpr);

    sections.forEach(section => {
      section.progress += delta * section.speed;
      if (section.progress > 1) section.progress -= 1;

      const pulse = Math.sin(section.progress * Math.PI * 2) * 0.5 + 0.5;
      const radius = section.width * 1.5;

      const gradient = ctx.createRadialGradient(
        section.x, section.y, 0,
        section.x, section.y, radius
      );

      gradient.addColorStop(0, `hsla(190, 100%, 50%, ${0.1 * pulse})`);
      gradient.addColorStop(0.5, `hsla(190, 100%, 50%, ${0.05 * pulse})`);
      gradient.addColorStop(1, 'hsla(190, 100%, 50%, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(section.x, section.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrame = requestAnimationFrame(animate);
  }

  // Debounced resize/init
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initSections();
    }, 100);
  }

  // Initialize
  resizeCanvas();
  initSections();
  animate(performance.now());

  window.addEventListener('resize', handleResize);

  const observer = new MutationObserver(() => {
    handleResize(); // re-init after layout change
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
