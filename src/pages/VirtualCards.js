// src/pages/VirtualCards.js
import React, { useState } from 'react';
import { createVirtualCard } from '../services/api';

function VirtualCards() {
  const userId = localStorage.getItem('userId');
  const [brand, setBrand] = useState('Visa');
  const [message, setMessage] = useState('');

  const handleCreateCard = async () => {
    try {
      const { data } = await createVirtualCard({ userId, brand });
      const info = data.card ? ` (Nro: ${data.card.cardNumber})` : '';
      setMessage(`${data.message} ${info}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Crear Tarjeta Virtual</h2>

        <div className="bg-white shadow rounded p-6 max-w-md">
          <label className="block text-gray-700 mb-2 font-semibold">
            Selecciona la marca de tarjeta:
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
          </select>
          <button
            onClick={handleCreateCard}
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Crear Tarjeta
          </button>

          {message && (
            <div className="mt-4 text-green-600">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VirtualCards;
