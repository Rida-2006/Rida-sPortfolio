(() => {
  const canvas = document.querySelector(".aurora");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = 720;
  canvas.height = 640;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const gradient = ctx.createLinearGradient(125, 505, 590, 115);
  gradient.addColorStop(0, "rgba(180,66,236,0)");
  gradient.addColorStop(.23, "rgba(237,113,255,.9)");
  gradient.addColorStop(.49, "rgba(146,139,255,.75)");
  gradient.addColorStop(.73, "rgba(47,178,253,.8)");
  gradient.addColorStop(1, "rgba(70,107,231,0)");

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = gradient;
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "lighter";
    for (let ribbon = 0; ribbon < 15; ribbon++) {
      ctx.beginPath();
      for (let step = 0; step <= 150; step++) {
        const angle = step * Math.PI * 2 / 150;
        const fold = Math.sin(3 * angle - time + ribbon * .045);
        const radius = 179 + 35 * fold + 16 * Math.sin(2 * angle + time);
        const spread = (ribbon - 7) * (3.5 + 2 * Math.cos(angle + time));
        const x = 367 + (radius + spread) * Math.cos(angle);
        const y = 314 + (radius * 1.09 + spread) * Math.sin(angle) + 24 * Math.cos(2 * angle);
        if (step === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.lineWidth = 13;
      ctx.filter = "blur(21px)";
      ctx.globalAlpha = .22;
      ctx.stroke();
      ctx.lineWidth = 2.5;
      ctx.filter = "blur(3px)";
      ctx.globalAlpha = .19;
      ctx.stroke();
    }
  }

  const button = document.getElementById("background-motion");
  let paused = motion.matches;
  let frame;
  let time = 0;
  let lastFrame = 0;
  function animate(now) {
    if (now - lastFrame >= 40) {
      time += Math.min(now - lastFrame, 50) * .00053;
      draw(time);
      lastFrame = now;
    }
    frame = requestAnimationFrame(animate);
  }

  function updateMotion() {
    cancelAnimationFrame(frame);
    const label = paused ? "Play moving background" : "Pause moving background";
    button.textContent = paused ? "▶" : "⏸";
    button.setAttribute("aria-label", label);
    button.title = label;
    if (!paused && !document.hidden) {
      lastFrame = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }
  button.addEventListener("click", () => {
    paused = !paused;
    updateMotion();
  });
  motion.addEventListener("change", () => {
    paused = motion.matches;
    updateMotion();
  });
  document.addEventListener("visibilitychange", updateMotion);
  draw(time);
  button.hidden = false;
  updateMotion();
})();
