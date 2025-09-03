export interface Hero {
  text: string;
}

export interface SideCardProps {
  title: string;
  description: string;
  content: string;
}

export interface MainCardProps extends SideCardProps {
  imageSrc: string;
  imageW: number;
  imageH: number;
}
