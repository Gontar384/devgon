import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SideHero } from '@/app/page-ui/side-card/SideHero';
import React from 'react';
import { SideCardProps } from '@/app/page-ui/types';

export const SideCard: React.FC<SideCardProps> = ({
  title,
  description,
  content,
}) => {
  return (
    <Card className="card-animate bg-background/80 backdrop-blur border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word">
      <CardHeader>
        <CardTitle>
          <SideHero text={title} />
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
