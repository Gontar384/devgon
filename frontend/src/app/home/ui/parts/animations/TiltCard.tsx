'use client';
import React, { useRef } from 'react';

export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const applyTilt = (x: number, y: number) => {
    if (!ref.current) return;

    ref.current.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };

  const resetTilt = () => {
    if (!ref.current) return;

    ref.current.style.transform =
      'perspective(800px) rotateY(0deg) rotateX(0deg)';
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    applyTilt(x, y);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = (touch.clientX - left) / width - 0.5;
    const y = (touch.clientY - top) / height - 0.5;

    applyTilt(x, y);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={resetTilt}
      onTouchMove={onTouchMove}
      onTouchEnd={resetTilt}
      style={{
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}
