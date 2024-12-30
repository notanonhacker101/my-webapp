// src/pages/LoginSeed.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hashSeed, loginWallet } from '../services/api';

function LoginSeed() {
  const navigate = useNavigate();

  // 24 campos para las 24 palabras
  const [seedWords, setSeedWords] = useState(Array(24).fill(''));

  // Manejo de cambio en cada campo
  const handleWordChange = (index, value) => {
    const newWords = [...seedWords];
    newWords[index] = value.trim();
    setSeedWords(newWords);
  };

  // Manejo de Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    // Unir las 24 palabras en una sola frase
    const mnemonic = seedWords.join(' ').trim();

    if (!mnemonic) {
      alert('Por favor, llena las 24 palabras');
      return;
    }

    try {
      // Hashear la frase
      const seedHash = hashSeed(mnemonic);
      console.log('[LoginSeed] seedHash:', seedHash);

      // Llamar al backend
      const { data } = await loginWallet(seedHash);
      console.log('[LoginSeed] login response:', data);

      // Guardar en localStorage
      localStorage.setItem('seedHash', seedHash);

      // Navegar al Dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('[LoginSeed] Error:', error);
      alert('Error al iniciar sesión con la seed phrase');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Login with Seed</h1>
      <p className="text-sm text-gray-400 mb-6">
        Ingresa las 24 palabras de tu frase de recuperación.
      </p>

      <form onSubmit={handleLogin} className="bg-gray-800 p-4 rounded max-w-xl w-full">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {seedWords.map((word, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">
                {index + 1}.
              </label>
              <input
                type="text"
                className="bg-gray-700 p-2 rounded text-sm
                           border border-gray-600 focus:outline-none 
                           focus:ring-2 focus:ring-purple-500 text-white"
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Access Wallet
        </button>
      </form>

      <div className="mt-4">
        <Link to="/create-wallet" className="text-purple-400 hover:underline text-sm">
          ¿No tienes una frase? Crea una cuenta
        </Link>
      </div>
    </div>
  );
}

export default LoginSeed;
