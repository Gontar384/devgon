'use client';
import React, { useState } from 'react';
import api from '../../lib/axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

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

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Dodaj produkt</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button
          className="hover:animate"
          type="submit"
          variant="outline"
          size="default"
        >
          Wyślij
        </Button>
      </form>
      <Button onClick={toggleDarkMode}>Dark Mode</Button>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
};

export default ProductsPage;
