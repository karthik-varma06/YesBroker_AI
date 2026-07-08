'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

interface Connection {
  a: number;
  b: number;
}

const COLORS = {
  particlePrimary:   'rgba(59,130,246,',
  particleSecondary: 'rgba(34,211,238,',
  particleTertiary:  'rgba(124,58,237,',
  lineColor:         'rgba(59,130,246,',
  lineColorCyan:     'rgba(34,211,238,',
};

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let particles: Particle[] = [];
    const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 55 : 100;
    const MAX_DIST = 160;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Initialise particles
    function init() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const colorRoll = Math.random();
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.15,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.008,
        });
      }
    }
    init();

    let time = 0;

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      // ── Ambient aurora blobs ──
      const grad1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.2, 0,
        canvas.width * 0.2, canvas.height * 0.2, canvas.width * 0.45
      );
      grad1.addColorStop(0, `rgba(59,130,246,${0.04 + Math.sin(time * 0.008) * 0.02})`);
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.4
      );
      grad2.addColorStop(0, `rgba(124,58,237,${0.035 + Math.sin(time * 0.006 + 1) * 0.015})`);
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad3 = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.45, 0,
        canvas.width * 0.5, canvas.height * 0.45, canvas.width * 0.35
      );
      grad3.addColorStop(0, `rgba(34,211,238,${0.025 + Math.sin(time * 0.01 + 2) * 0.01})`);
      grad3.addColorStop(1, 'transparent');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Move particles ──
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < -5)             p.x = canvas!.width  + 5;
        if (p.x > canvas!.width  + 5) p.x = -5;
        if (p.y < -5)             p.y = canvas!.height + 5;
        if (p.y > canvas!.height + 5) p.y = -5;
      });

      // ── Draw connections ──
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            // Alternate between blue and cyan for lines
            const useCyan = (i + j) % 5 === 0;
            ctx.beginPath();
            ctx.strokeStyle = useCyan
              ? `rgba(34,211,238,${alpha})`
              : `rgba(59,130,246,${alpha * 0.9})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // ── Draw particles ──
      particles.forEach((p, i) => {
        const pulsingOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        // Color variety
        let colorStr: string;
        if (i % 7 === 0)      colorStr = `rgba(34,211,238,${pulsingOpacity})`;
        else if (i % 11 === 0) colorStr = `rgba(124,58,237,${pulsingOpacity * 0.8})`;
        else                   colorStr = `rgba(59,130,246,${pulsingOpacity})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorStr;
        ctx.fill();

        // Glow for larger nodes
        if (p.radius > 1.4) {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
          grd.addColorStop(0, `rgba(59,130,246,${pulsingOpacity * 0.25})`);
          grd.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="neural-canvas"
      style={{ opacity: 0.85 }}
    />
  );
}
