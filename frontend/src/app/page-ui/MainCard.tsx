import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Hero from '@/app/page-ui/Hero';
import Image from 'next/image';
import React from 'react';

interface Props {
  title: string;
  description: string;
  content: string;
  imageSrc: string;
}

export const MainCard: React.FC<Props> = ({
  title,
  description,
  content,
  imageSrc,
}) => {
  return (
    <Card className="card-animate bg-background/80 backdrop-blur border shadow-xl hover:scale-105 transition-transform duration-300 wrap-break-word px-6">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>
              <Hero text={title} />
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{content}</CardContent>
        </div>
        <div className="flex-shrink-0">
          <Image
            src={imageSrc}
            alt="Web developer"
            width={400}
            height={400}
            priority
            className="rounded-lg"
          />
        </div>
      </div>
    </Card>
  );
};
