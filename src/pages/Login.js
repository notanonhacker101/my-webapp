// src/pages/Login.js
import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de login
    localStorage.setItem('userId', '1234567890');
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">NCRO Bank (Dark)</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-300">Correo</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 text-gray-100 
                         border border-gray-600 focus:outline-none 
                         focus:ring-2 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@mail.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-300">Contraseña</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 text-gray-100 
                         border border-gray-600 focus:outline-none 
                         focus:ring-2 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-600 text-gray-100 font-semibold py-2 rounded 
                       hover:bg-gray-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
