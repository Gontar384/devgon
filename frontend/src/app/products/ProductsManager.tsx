'use client';
import React, { useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface Product {
  id: string;
  title: string;
  description: string;
}

interface Props {
  initialProducts: Product[];
}

export const ProductsManager: React.FC<Props> = ({
  initialProducts,
}: Props) => {
  const { data: products, mutate } = useSWR<Product[]>(
    '/api/products',
    fetcher,
    {
      fallbackData: initialProducts,
      revalidateOnFocus: true,
    },
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/products', { title, description });
      if (res.status === 201) {
        const newProduct = res.data;
        mutate((current) => [...(current ?? []), newProduct], {
          revalidate: true,
        });
        setMessage('Produkt został dodany!');
        setTitle('');
        setDescription('');
      } else {
        setMessage('Wystąpił błąd podczas dodawania produktu.');
      }
    } catch (err) {
      setMessage('Błąd sieci: ' + String(err));
    }
  };

  return (
    <section className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Dodaj produkt</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="md:text-base"
        />
        <Textarea
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="resize-none h-24 md:text-base"
        />
        <Button
          type="submit"
          variant="default"
          className="hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary select-none"
        >
          Wyślij
        </Button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}

      <ul className="mt-6 space-y-2">
        {(products ?? []).map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong>: {p.description}
          </li>
        ))}
      </ul>
    </section>
  );
};
