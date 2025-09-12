export interface SideHeroProps {
  text: string;
  mode: string;
}

export interface SideCardProps {
  sideHero: SideHeroProps;
  description: string;
  content: string;
}

export interface MainHeroProps {
  text: string;
  speed: number;
  deleteSpeed: number;
  pause: number;
  mode: string;
}

export interface MainCardProps {
  mainHero: MainHeroProps;
  description: string;
  content: string;
  imageSrc: string;
  imageAlt: string;
  imageW: number;
  imageH: number;
}

export interface TypingEffectProps {
  text: string;
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
  mode?: string;
}
