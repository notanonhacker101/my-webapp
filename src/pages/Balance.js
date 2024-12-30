// src/pages/Balance.js
import React, { useState, useEffect } from 'react';
import { getBalance, depositCrypto, withdrawCrypto } from '../services/api';

function Balance() {
  const [balanceData, setBalanceData] = useState({ balance: 0, cryptos: [] });
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line
  }, []);

  const fetchBalance = async () => {
    try {
      const { data } = await getBalance(userId);
      setBalanceData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await depositCrypto({ userId, symbol, amount: parseFloat(amount) });
      setSymbol('');
      setAmount('');
      fetchBalance();
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await withdrawCrypto({ userId, symbol, amount: parseFloat(amount) });
      setSymbol('');
      setAmount('');
      fetchBalance();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          Balance de tu Cuenta
        </h2>
        <div className="bg-white shadow rounded p-6 mb-6">
          <p className="text-gray-700 text-lg font-medium">
            Saldo total (USD): <span className="font-bold">{balanceData.balance}</span>
          </p>
          <h3 className="text-gray-600 font-semibold mt-4">Tus Criptomonedas:</h3>
          <div className="mt-2 space-y-1">
            {balanceData.cryptos.map((c, idx) => (
              <div key={idx} className="text-gray-700">
                <strong>{c.symbol}:</strong> {c.amount}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario de Depósito */}
          <form 
            onSubmit={handleDeposit}
            className="bg-white shadow rounded p-6"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Depositar Cripto</h3>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Símbolo (ej: BTC)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Cantidad</label>
              <input
                type="number"
                step="any"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
            >
              Depositar
            </button>
          </form>

          {/* Formulario de Retiro */}
          <form 
            onSubmit={handleWithdraw}
            className="bg-white shadow rounded p-6"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Retirar Cripto</h3>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Símbolo (ej: BTC)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Cantidad</label>
              <input
                type="number"
                step="any"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600"
            >
              Retirar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Balance;
