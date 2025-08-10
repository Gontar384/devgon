'use client';
import React, { useState } from 'react';
import api from '../../services/axios';

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
    <main className="max-w-md mx-auto p-4 bg-purple-500">
      <h1 className="text-2xl font-bold mb-4">Dodaj produkt</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Wyślij
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
};

export default ProductsPage;
