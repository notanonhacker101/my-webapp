// src/pages/CryptoDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBalance, getTransactions } from '../services/api';

function CryptoDetail() {
  const navigate = useNavigate();
  const { symbol } = useParams(); // p.ej. 'BTC'
  const seedHash = localStorage.getItem('seedHash');
  if (!seedHash) {
    navigate('/');
  }

  const [balanceCrypto, setBalanceCrypto] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchCryptoBalance();
    fetchHistory();
    // eslint-disable-next-line
  }, [symbol]);

  // Cargar balance para esa cripto
  const fetchCryptoBalance = async () => {
    try {
      const { data } = await getBalance(seedHash);
      // data.cryptos => [ {symbol: 'BTC', amount}, {symbol: 'ETH', amount}...]
      const found = data.cryptos.find(c => c.symbol === symbol);
      if (found) {
        setBalanceCrypto(found.amount);
      } else {
        setBalanceCrypto(0);
      }
    } catch (error) {
      console.error('[CryptoDetail] Error fetchCryptoBalance:', error);
    }
  };

  // Cargar historial (depósitos y retiros) para la cripto
  const fetchHistory = async () => {
    try {
      const { data } = await getTransactions(symbol, seedHash);
      // data.transactions => array de { type: 'deposit'|'withdraw', amount, createdAt }
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('[CryptoDetail] Error fetchHistory:', error);
    }
  };

  const handleBack = () => {
    navigate('/'); // Regresar al dashboard
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4">
      <button
        className="bg-gray-700 px-3 py-2 rounded hover:bg-gray-600"
        onClick={handleBack}
      >
        Back
      </button>

      <h1 className="text-2xl font-bold mt-4 mb-2">
        {symbol} Details
      </h1>

      <p className="text-sm text-gray-400 mb-4">
        Current balance: {balanceCrypto} {symbol}
      </p>

      <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
      <div className="space-y-2">
        {transactions.map((tx, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-3 rounded flex justify-between"
          >
            <span className="font-medium">
              {tx.type} {/* 'deposit' or 'withdraw' */}
            </span>
            <span className="text-right">
              {tx.amount} {symbol}
              <br />
              <span className="text-xs text-gray-400">
                {new Date(tx.createdAt).toLocaleString()}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CryptoDetail;
