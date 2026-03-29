'use client';
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import {
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

export const ParticlesBackground = ({ id }: { id: string }) => {
  const [init, setInit] = useState(false);
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    [],
  );

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: { color: { value: '' } },
      fpsLimit: isMobile ? 60 : 120,
      interactivity: {
        events: {
          onClick: {},
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 150, duration: 0.4 },
        },
      },
      particles: {
        color: { value: '#000000' },
        links: {
          color: '#e57f73',
          distance: isMobile ? 400 : 300,
          enable: true,
          opacity: 1,
          width: isMobile ? 4 : 6,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: { default: OutMode.out },
          random: false,
          speed: isMobile ? 4 : 6,
          straight: false,
        },
        number: {
          density: { enable: true },
          value: isMobile ? 30 : 50,
        },
        opacity: { value: 1 },
        shape: { type: 'circle' },
        size: {
          value: isMobile ? { min: 5, max: 10 } : { min: 7, max: 15 },
        },
      },
      detectRetina: true,
    }),
    [isMobile],
  );

  if (!init) return <></>;

  return (
    <Particles
      id={id}
      options={{ ...options, fullScreen: { enable: false } }}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
};
