'use client';

import { useRef, useEffect } from 'react';
import { useDeviceStore } from '@/store/deviceStore';
import { CursorGlowProps } from '@/app/home/home-types';

export function CursorGlow({ cursorColor }: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceStore();

  useEffect(() => {
    if (!glowRef.current) return;

    const glowEl = glowRef.current;
    let posX = 0;
    let posY = 0;
    let targetX = 0;
    let targetY = 0;
    let fadeTimeout: ReturnType<typeof setTimeout>;

    const animate = () => {
      posX += (targetX - posX) * 0.1;
      posY += (targetY - posY) * 0.1;
      glowEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      requestAnimationFrame(animate);
    };

    animate();

    if (isMobile) {
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const rect = glowEl.parentElement!.getBoundingClientRect();

        targetX = touch.clientX - rect.left - 40;
        targetY = touch.clientY - rect.top - 40;
        glowEl.style.opacity = '0.5';

        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => {
          glowEl.style.opacity = '0';
        }, 300);
      };

      const handleTouchEnd = () => {
        clearTimeout(fadeTimeout);
        glowEl.style.opacity = '0';
      };

      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        clearTimeout(fadeTimeout);
      };
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = glowEl.parentElement!.getBoundingClientRect();

        const isInside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        glowEl.style.opacity = isInside ? '0.5' : '0';
        targetX = e.clientX - rect.left - 40;
        targetY = e.clientY - rect.top - 40;
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isMobile]);

  return (
    <div className="absolute inset-0 pointer-events-none z-35">
      <div
        ref={glowRef}
        className={`absolute w-20 h-20 bg-${cursorColor} rounded-full pointer-events-none blur-lg transition-opacity duration-300`}
        style={{
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
          opacity: 0,
        }}
      />
    </div>
  );
}
