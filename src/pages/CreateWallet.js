import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos la función para generar la seed
import { generateMnemonic } from '@scure/bip39';
// Importamos nuestra lista de 2048 palabras en inglés (local)
import { englishWordlist } from '../wordlists/englishWordlist';

function CreateWallet() {
  const navigate = useNavigate();

  // Aquí guardamos la frase generada
  const [mnemonic, setMnemonic] = useState('');

  // Checkbox para confirmar si el usuario guardó su seed
  const [hasSaved, setHasSaved] = useState(false);

  // Generamos la frase una vez montado el componente
  useEffect(() => {
    // 256 bits => 24 palabras
    const newSeed = generateMnemonic(englishWordlist, 256);
    setMnemonic(newSeed);
  }, []);

  // Separamos la frase en un array para mostrar palabra por palabra
  const words = mnemonic.split(' ');

  // Handler para el botón "Continue"
  const handleContinue = () => {
    if (!hasSaved) {
      alert('Please confirm that you have saved your seed phrase.');
      return;
    }
    // Ejemplo: redirigimos al home ("/") o a tu login
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-2">Secret Recovery Phrase</h1>
      <p className="text-sm text-yellow-200 mb-6">
        This phrase is the ONLY way to recover your wallet.
        Store it somewhere safe. Do <strong>NOT</strong> share it with anyone.
      </p>

      <div className="bg-gray-800 rounded p-4 max-w-xl w-full">
        {/* Grid para mostrar cada palabra numerada */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {words.map((word, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-700 p-2 rounded text-sm"
            >
              <span className="text-gray-400 mr-2">{index + 1}.</span>
              <span>{word}</span>
            </div>
          ))}
        </div>

        {/* Checkbox para confirmar */}
        <label className="flex items-center mb-4 text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-purple-600"
            checked={hasSaved}
            onChange={(e) => setHasSaved(e.target.checked)}
          />
          <span className="ml-2">
            I have securely saved my Secret Recovery Phrase
          </span>
        </label>

        {/* Botón Continue */}
        <button
          onClick={handleContinue}
          disabled={!hasSaved}
          className={`w-full py-2 rounded font-semibold
            ${hasSaved 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-gray-600 cursor-not-allowed'}
            text-white transition-colors`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default CreateWallet;
