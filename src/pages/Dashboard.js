import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBalance } from '../services/api';

// Íconos de React Icons
import {
  AiOutlineDownload,
  AiOutlineUpload,
  AiOutlineSwap,
  AiOutlineShopping,
  AiFillCreditCard,
  AiOutlineSliders,
} from 'react-icons/ai';
import { FaBitcoin } from 'react-icons/fa';

// Logo (ajusta la ruta si difiere)
import ncroLogo from '../assets/ncro-logo.png';

// Mapa de imágenes para tokens
const cryptoImgMap = {
  BTC: 'https://cryptocurrencyliveprices.com/img/btc-bitcoin.png',
  ETH: 'https://cryptocurrencyliveprices.com/img/eth-ethereum.png',
  USDT: 'https://cryptocurrencyliveprices.com/img/usdt-tether.png',
  SOL: 'https://cryptocurrencyliveprices.com/img/solana.png',
};

// Mapeo para coingecko (buscar precios)
const coingeckoMap = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  USDT: 'tether',
};

// Animación de gradiente
const moveGradientKeyframe = `
@keyframes moveGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`;

export default function Dashboard() {
  const navigate = useNavigate();

  // Estado con cryptos (balance real) y precios
  const [cryptos, setCryptos] = useState([]);
  const [prices, setPrices] = useState({});
  const [totalUSD, setTotalUSD] = useState(0);

  // Popup de Manage token list
  const [showManageTokens, setShowManageTokens] = useState(false);

  // Lista de tokens disponibles en la webapp,
  // sin saldos ni cantidades por defecto, solo name + symbol + icon + isActive
  const [availableTokens, setAvailableTokens] = useState([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      iconUrl: cryptoImgMap.BTC,
      isActive: true,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      iconUrl: cryptoImgMap.ETH,
      isActive: true,
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      iconUrl: cryptoImgMap.USDT,
      isActive: false,
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      iconUrl: cryptoImgMap.SOL,
      isActive: false,
    },
  ]);

  // Valida seedHash
  const seedHash = localStorage.getItem('seedHash');
  if (!seedHash) {
    navigate('/');
  }

  useEffect(() => {
    fetchCryptos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    calculateTotalUSD();
    // eslint-disable-next-line
  }, [cryptos, prices]);

  // Carga cryptos (balance real) desde backend
  const fetchCryptos = async () => {
    try {
      const { data } = await getBalance(seedHash);
      // data.cryptos => [{ symbol: 'BTC', amount: 0.05 }, ...]
      setCryptos(data.cryptos || []);
      fetchPrices(data.cryptos);
    } catch (error) {
      console.error('[Dashboard] getBalance error:', error);
    }
  };

  // Carga precios
  const fetchPrices = async (cryptoList) => {
    try {
      const symbols = (cryptoList || []).map((c) => c.symbol);
      const uniqueSymbols = [...new Set(symbols)];
      const coingeckoIds = uniqueSymbols
        .map((sym) => coingeckoMap[sym])
        .filter(Boolean);
      if (!coingeckoIds.length) return;

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds.join(
        ','
      )}&vs_currencies=usd`;
      const res = await fetch(url);
      const json = await res.json();

      const newPrices = {};
      for (const [cgId, info] of Object.entries(json)) {
        const found = Object.entries(coingeckoMap).find(
          ([symbol, cgid]) => cgid === cgId
        );
        if (found) {
          newPrices[found[0]] = info.usd;
        }
      }
      setPrices(newPrices);
    } catch (error) {
      console.error('[Dashboard] fetchPrices error:', error);
    }
  };

  // Calcula total
  const calculateTotalUSD = () => {
    let sum = 0;
    cryptos.forEach((c) => {
      const price = prices[c.symbol] || 0;
      sum += c.amount * price;
    });
    setTotalUSD(sum);
  };

  // Botones
  const handleReceive = () => navigate('/deposit');
  const handleSend = () => navigate('/withdrawal');
  const handleSwap = () => alert('Swap not implemented yet.');
  const handleBuy = () => alert('Buy not implemented yet.');
  const handleCard = () => navigate('/virtual-cards');

  // Click en cripto
  const handleCryptoClick = (symbol) => {
    navigate(`/crypto/${symbol}`);
  };

  // Filtra cryptos según isActive en availableTokens
  const visibleCryptos = cryptos.filter((c) => {
    const tokenObj = availableTokens.find((t) => t.symbol === c.symbol);
    return tokenObj?.isActive;
  });

  // Popup => abrir/cerrar
  const openManageTokens = () => setShowManageTokens(true);
  const closeManageTokens = () => setShowManageTokens(false);

  // Toggle isActive
  const handleToggleToken = (symbol) => {
    setAvailableTokens((prev) =>
      prev.map((t) =>
        t.symbol === symbol ? { ...t, isActive: !t.isActive } : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#222222] w-full flex flex-col relative">
      {/* Inyectamos keyframes para gradiente */}
      <style>{moveGradientKeyframe}</style>

      {/* SECCIÓN SUPERIOR */}
      <div
        className="w-full"
        style={{
          minHeight: '320px',
          borderBottomLeftRadius: '30px',
          borderBottomRightRadius: '30px',
          overflow: 'hidden',
          background: 'linear-gradient(90deg, #ff00c8, #6e00ff, #250477)',
          backgroundSize: '200% 200%',
          backgroundPosition: '0% 50%',
          animation: 'moveGradient 8s linear infinite',
        }}
      >
        <header className="flex items-center justify-between p-4 bg-transparent">
          <div className="flex items-center gap-2">
            <img src={ncroLogo} alt="NCRO Logo" className="w-10 h-10 object-contain" />
          </div>
        </header>

        <div className="flex flex-col items-center px-4 pb-10">
          <div className="text-center mb-6 mt-4">
            {/* Saldo total */}
            <h3 className="text-5xl font-bold text-white">
              ${totalUSD.toFixed(2)}
            </h3>
          </div>

          {/* Botones */}
          <div className="flex gap-3 flex-wrap justify-center mt-2">
            <button
              onClick={handleReceive}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2A2A2A] rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <AiOutlineDownload />
              <span>Receive</span>
            </button>
            <button
              onClick={handleSend}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2A2A2A] rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <AiOutlineUpload />
              <span>Send</span>
            </button>
            <button
              onClick={handleSwap}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2A2A2A] rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <AiOutlineSwap />
              <span>Swap</span>
            </button>
            <button
              onClick={handleBuy}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2A2A2A] rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <AiOutlineShopping />
              <span>Buy</span>
            </button>
            <button
              onClick={handleCard}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2A2A2A] rounded hover:bg-purple-500 transition-colors text-sm"
            >
              <AiFillCreditCard />
              <span>Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* LISTA DE CRYPTOS */}
      <div className="px-4 py-8">
        <h4 className="text-lg font-semibold mb-4 text-white">Your Cryptos</h4>
        <div className="space-y-2">
          {visibleCryptos.map((c, idx) => {
            const price = prices[c.symbol] || 0;
            const coinUSD = c.amount * price;

            const customIconUrl = cryptoImgMap[c.symbol];

            return (
              <div
                key={idx}
                onClick={() => handleCryptoClick(c.symbol)}
                className="bg-[#2A2A2A] rounded p-4 flex items-center justify-between cursor-pointer hover:bg-[#333333] transition"
              >
                <div className="flex items-center gap-2">
                  {customIconUrl ? (
                    <img
                      src={customIconUrl}
                      alt={`${c.symbol} icon`}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <FaBitcoin className="text-yellow-400 text-xl" />
                  )}
                  <div>
                    <h2 className="font-semibold text-base text-white">
                      {c.symbol}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {c.amount} {c.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-white">
                    ${coinUSD.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón => "Manage token list" con icono sliders, centrado */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowManageTokens(true)}
            className="flex items-center justify-center gap-1 text-sm text-gray-300 hover:text-gray-200 cursor-pointer"
          >
            <AiOutlineSliders className="text-lg" />
            <span>Manage token list</span>
          </button>
        </div>
      </div>

      {/* Popup => Manage token list */}
      {showManageTokens && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#2A2A2A] rounded w-80 max-h-[80vh] overflow-auto p-4 relative flex flex-col">
            <h2 className="text-xl text-white font-semibold mb-4 flex-shrink-0">
              Manage token list
            </h2>

            {/* Lista de tokens con toggle (sin mostrar balances ni cantidades) */}
            <div className="flex-grow space-y-3">
              {availableTokens.map((token, idx) => (
                <div
                  key={idx}
                  className="bg-[#333] rounded p-3 flex items-center justify-between"
                >
                  {/* Izquierda: icono + name */}
                  <div className="flex items-center gap-2">
                    {token.iconUrl ? (
                      <img
                        src={token.iconUrl}
                        alt={token.symbol}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-500 rounded" />
                    )}
                    <div>
                      <p className="text-white font-semibold">
                        {token.name}
                      </p>
                      {/* No mostramos saldos ni amounts */}
                    </div>
                  </div>

                  {/* Derecha: toggle switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={token.isActive}
                      onChange={() => handleToggleToken(token.symbol)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-colors 
                      peer-checked:after:translate-x-full after:content-[''] after:absolute
                      after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
                      after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all peer-checked:after:translate-x-5
                      relative"
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Botón close */}
            <button
              onClick={() => setShowManageTokens(false)}
              className="mt-4 bg-[#333] hover:bg-[#444] text-white rounded py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
