import { Property } from 'csstype';
import Content = Property.Content;

export interface AboutManagerProps {
  contents: Record<string, Content[]>;
}

export interface AboutCardProps {
  content: Content;
}
