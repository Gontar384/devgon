'use client';

import { useRef, useEffect } from 'react';
import { useDeviceStore } from '@/store/deviceStore';

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const { isMobile } = useDeviceStore();

  useEffect(() => {
    if (!glowRef.current || isMobile) return;

    const glowEl = glowRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = glowEl.parentElement!.getBoundingClientRect();

      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      hoveringRef.current = isInside;
      glowEl.style.opacity = isInside ? '0.5' : '0';

      mouseX = e.clientX - rect.left - 32;
      mouseY = e.clientY - rect.top - 32;
    };

    const animate = () => {
      posX += (mouseX - posX) * 0.1;
      posY += (mouseY - posY) * 0.1;

      glowEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <div
        ref={glowRef}
        className="absolute w-16 h-16 bg-primary rounded-full pointer-events-none blur-xl transition-opacity duration-150"
        style={{
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
          opacity: 0,
        }}
      />
    </div>
  );
}
