import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Hero1 from '@/app/page-ui/Hero1';
import React from 'react';

interface Props {
  title: string;
  description: string;
  content: string;
}

export const SmallCard: React.FC<Props> = ({ title, description, content }) => {
  return (
    <Card className="card-animate bg-background/80 backdrop-blur border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word">
      <CardHeader>
        <CardTitle>
          <Hero1 text={title} />
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
