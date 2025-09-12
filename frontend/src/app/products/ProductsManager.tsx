'use client';
import React, { useRef, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
}

interface Props {
  initialProducts: Product[];
}

export function ProductsManager({ initialProducts }: Props) {
  const { data: products, mutate } = useSWR<Product[]>(
    '/api/products',
    fetcher,
    {
      fallbackData: initialProducts,
      revalidateOnFocus: true,
    },
  );
  const [title, setTitle] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setShowErrors(true);
      titleRef.current?.focus();
      return;
    }
    if (!description.trim()) {
      setShowErrors(true);
      descriptionRef.current?.focus();
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/api/products', { title, description });
      if (res.status === 201) {
        const newProduct = res.data;
        mutate((current) => [...(current ?? []), newProduct], {
          revalidate: true,
        });
        setTitle('');
        setDescription('');
        setShowErrors(false);
        toast.success('Produkt został dodany! 🎉');
      } else {
        toast.error('Wystąpił błąd podczas dodawania produktu.');
      }
    } catch {
      toast.error('Wystąpił błąd podczas dodawania produktu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-10 select-none">Dodaj produkt</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <label htmlFor="title" className="sr-only">
          Tytuł produktu
        </label>
        <Tooltip open={showErrors && !title.trim()}>
          <TooltipTrigger asChild>
            <Input
              className="md:text-base"
              ref={titleRef}
              id="title"
              type="text"
              placeholder="Tytuł"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={showErrors && !title.trim()}
              aria-describedby={
                showErrors && !title.trim() ? 'title-error' : undefined
              }
            />
          </TooltipTrigger>
          <TooltipContent side="top" className="!z-35">
            <p>Tytuł jest wymagany</p>
          </TooltipContent>
        </Tooltip>
        {showErrors && !title.trim() && (
          <p id="title-error" className="sr-only">
            Tytuł jest wymagany
          </p>
        )}
        <label htmlFor="description" className="sr-only">
          Opis produktu
        </label>
        <Tooltip open={showErrors && !description.trim()}>
          <TooltipTrigger asChild>
            <Textarea
              ref={descriptionRef}
              id="description"
              placeholder="Opis"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={showErrors && !description.trim()}
              aria-describedby={
                showErrors && !description.trim()
                  ? 'description-error'
                  : undefined
              }
              className="resize-none h-24 md:text-base"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="!z-35">
            <p>Opis jest wymagany</p>
          </TooltipContent>
        </Tooltip>
        {showErrors && !description.trim() && (
          <p id="description-error" className="sr-only">
            Opis jest wymagany
          </p>
        )}
        <div className="flex items-center">
          <Button
            type="submit"
            variant="default"
            className="hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary select-none"
            disabled={isLoading}
          >
            {isLoading && <Loader2Icon className="animate-spin" />}
            Wyślij
          </Button>
          <Image
            className="select-none"
            src="/svg/friendly-guy-avatar.svg"
            alt="Friendly guy avatar"
            width={60}
            height={60}
            priority
          />
        </div>
      </form>
      <Table>
        <caption className="sr-only">
          Lista produktów z tytułem i opisem
        </caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Tytuł</TableHead>
            <TableHead scope="col">Opis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(products ?? []).map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>{p.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
