// src/pages/Transactions.js
import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await getTransactions(userId);
      setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Historial de Transacciones</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-600">No hay transacciones registradas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.map((tx) => (
              <div key={tx._id} className="bg-white shadow rounded p-4">
                <p className="text-gray-700"><strong>Tipo:</strong> {tx.type}</p>
                <p className="text-gray-700"><strong>Cripto:</strong> {tx.cryptoSymbol}</p>
                <p className="text-gray-700"><strong>Cantidad:</strong> {tx.amount}</p>
                <p className="text-gray-700"><strong>Estado:</strong> {tx.status}</p>
                <p className="text-gray-700">
                  <strong>Fecha:</strong> {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
