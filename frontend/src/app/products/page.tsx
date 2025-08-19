'use client';
import React, { useState } from 'react';
import api from '../../lib/axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import SEO from '@/components/SEO';

const ProductsPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/products', { title, description });
      if (res.status === 201) {
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
    <>
      <SEO
        title="Dodaj nowy produkt – Moja Strona"
        description="Dodaj nowy produkt do naszej bazy. Wypełnij tytuł i opis produktu i wyślij formularz."
        path="/products"
      />
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-2xl mb-4">Dodaj produkt</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            className="md:text-base"
            type="text"
            placeholder="Tytuł"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            className="resize-none md:text-base"
            spellCheck={false}
            autoCorrect="off"
            placeholder="Opis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button
            className="select-none hover:bg-primary hover:cursor-pointer hover:scale-105 active:scale-105"
            type="submit"
            variant="default"
            size="default"
          >
            Wyślij
          </Button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </main>
    </>
  );
};

export default ProductsPage;
