// client/src/pages/Deposit.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositCrypto } from '../services/api';

function Deposit() {
  const navigate = useNavigate();
  const seedHash = localStorage.getItem('seedHash') || '';

  const [symbol, setSymbol] = useState('BTC');
  const [network, setNetwork] = useState('Bitcoin'); // Ejemplo: BTC, Ethereum, Tron
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  
  // Generar dirección aleatoria si deseas
  const handleGenerateAddress = () => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    // Ejemplo:
    const newAddress = `${symbol.toLowerCase()}_ADDR_${random}`;
    setAddress(newAddress);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await depositCrypto({
        seedHash,
        symbol,
        amount: parseFloat(amount),
        network,
        address, // si en el backend depositCrypto también lo maneja
      });
      alert(`Depositado ${amount} ${symbol} en address ${address}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('[Deposit] Error:', error);
      alert('Error al depositar');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Depósito</h1>
      <form onSubmit={handleDeposit} className="space-y-4 max-w-md">
        {/* Seleccionar cripto */}
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

        {/* Network */}
        <div>
          <label className="block mb-1 font-semibold">Network</label>
          <select
            className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
          >
            {/* Ejemplos */}
            <option value="Bitcoin">Bitcoin (BTC)</option>
            <option value="Ethereum">Ethereum (ERC-20)</option>
            <option value="Tron">Tron (TRC-20)</option>
            <option value="Solana">Solana</option>
          </select>
        </div>

        {/* Generar dirección local */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateAddress}
            className="bg-gray-700 px-3 py-2 rounded"
          >
            Generar Dirección
          </button>
          {address && (
            <span className="bg-gray-900 px-2 py-1 rounded text-xs">
              {address}
            </span>
          )}
        </div>

        {/* Monto */}
        <div>
          <label className="block mb-1 font-semibold">Monto</label>
          <input
            type="number"
            className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Cantidad"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 px-4 py-2 rounded font-semibold hover:bg-green-700"
        >
          Depositar
        </button>
      </form>
    </div>
  );
}

export default Deposit;
