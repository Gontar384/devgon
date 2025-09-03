'use client';
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import {
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

export const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: '',
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {},
          onHover: {
            enable: true,
            mode: 'repulse',
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 130,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#000000',
        },
        links: {
          color: '#000000',
          distance: 150,
          enable: true,
          opacity: 0.6,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 100,
        },
        opacity: {
          value: 0.8,
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 3, max: 7 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={{ ...options, fullScreen: { enable: false } }}
        className="absolute inset-0 pointer-events-none z-30"
      />
    );
  }

  return <></>;
};
