// client/src/pages/Withdrawal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withdrawCrypto } from '../services/api';

function Withdrawal() {
  const navigate = useNavigate();
  const seedHash = localStorage.getItem('seedHash') || '';

  const [symbol, setSymbol] = useState('BTC');
  const [network, setNetwork] = useState('Bitcoin');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await withdrawCrypto({
        seedHash,
        symbol,
        amount: parseFloat(amount),
        network,
        destination,
      });
      alert(`Retiro iniciado: ${amount} ${symbol} hacia ${destination}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('[Withdrawal] Error:', error);
      alert('Error al retirar');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Retiro</h1>
      <form onSubmit={handleWithdraw} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-semibold">Cripto</label>
          <select
            className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Network</label>
          <select
            className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            <option value="Bitcoin">Bitcoin</option>
            <option value="Ethereum">Ethereum (ERC-20)</option>
            <option value="Tron">Tron (TRC-20)</option>
            <option value="Solana">Solana</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Destino</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700"
            placeholder="0x..., bc1q..., etc."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Monto</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-red-600 px-4 py-2 rounded font-semibold hover:bg-red-700"
        >
          Retirar
        </button>
      </form>
    </div>
  );
}

export default Withdrawal;
