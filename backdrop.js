document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.querySelector('.animated-backdrop');
  const canvas = document.createElement('canvas');
  backdrop.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height, dpr = window.devicePixelRatio || 1;

  const sections = [];
  let animationFrame;
  let lastTime = performance.now();

  function resizeCanvas() {
    width = canvas.width = window.innerWidth * dpr;
    height = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

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
        speed: 0.1 + Math.random() * 0.2
      });
    });
  }

  function animate(now) {
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    const bgGradient = ctx.createLinearGradient(0, 0, 0, height / dpr);
    bgGradient.addColorStop(0, 'rgba(10, 10, 10, 0.95)');
    bgGradient.addColorStop(1, 'rgba(10, 10, 10, 0.98)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width / dpr, height / dpr);

    ctx.globalCompositeOperation = 'lighter';

    sections.forEach(section => {
      section.progress += delta * section.speed;
      if (section.progress > 1) section.progress -= 1;

      const hue = (section.progress * 360) % 360;
      const pulse = Math.sin(section.progress * Math.PI * 2) * 0.5 + 0.5;
      const radius = section.width * 1.5;

      const driftX = Math.sin(now / 1000 + section.x) * 5;
      const driftY = Math.cos(now / 1000 + section.y) * 5;
      const cx = section.x + driftX;
      const cy = section.y + driftY;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, ${0.1 * pulse})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 100%, 60%, ${0.05 * pulse})`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';

    animationFrame = requestAnimationFrame(animate);
  }

  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initSections();
    }, 100);
  }

  resizeCanvas();
  initSections();
  animate(performance.now());

  window.addEventListener('resize', handleResize);

  const observer = new MutationObserver(() => {
    handleResize();
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
