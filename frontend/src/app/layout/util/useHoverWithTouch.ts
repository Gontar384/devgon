import { useRef, useState } from 'react';

export function useHoverWithTouch() {
  const [hovered, setHovered] = useState(false);
  const isTouch = useRef(false);

  return {
    hovered,
    handlers: {
      onMouseEnter: () => {
        if (!isTouch.current) setHovered(true);
      },
      onMouseLeave: () => {
        if (isTouch.current) {
          isTouch.current = false;
          return;
        }
        setHovered(false);
      },
      onTouchStart: () => {
        isTouch.current = true;
        setHovered(true);
      },
      onTouchEnd: () => setHovered(false),
      onTouchCancel: () => setHovered(false),
      onTouchMove: () => setHovered(false),
    },
  };
}
