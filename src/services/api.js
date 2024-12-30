import axios from 'axios';
// Agregamos crypto-js si quieres realmente hashear la seed
import CryptoJS from 'crypto-js';

// Ajusta si tu servidor corre en otro puerto o dominio
const API_URL = 'http://localhost:4000/api';

// Función para hashear la seed
export const hashSeed = (seedPhrase) => {
  // Ejemplo con SHA-256
  return CryptoJS.SHA256(seedPhrase).toString();
};

// Login o crear wallet
export const loginWallet = (seedHash) => {
  return axios.post(`${API_URL}/wallet/login`, { seedHash });
};

// Obtener balance (cryptos + cards)
export const getBalance = (seedHash) => {
  return axios.get(`${API_URL}/wallet/balance/${seedHash}`);
};

// Historial transacciones de UNA cripto
export const getTransactions = (symbol, seedHash) => {
  return axios.get(`${API_URL}/wallet/transactions/${symbol}?seedHash=${seedHash}`);
};

// Depositar cripto
export const depositCrypto = (data) => {
  return axios.post(`${API_URL}/wallet/deposit`, data);
};

// Retirar cripto
export const withdrawCrypto = (data) => {
  return axios.post(`${API_URL}/wallet/withdraw`, data);
};

// Crear tarjeta virtual
export const createVirtualCard = (data) => {
  return axios.post(`${API_URL}/wallet/virtualcard`, data);
};

// ---- Admin Panel endpoints ---- //

export const adminListUsers = () => {
  return axios.get(`${API_URL}/admin/users`);
};

export const adminGetUserDetail = (userId) => {
  return axios.get(`${API_URL}/admin/users/${userId}`);
};

export const adminListTransactions = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return axios.get(`${API_URL}/admin/transactions?${query}`);
};

export const adminUpdateTxStatus = (txId, newStatus) => {
  return axios.patch(`${API_URL}/admin/transactions/${txId}`, { newStatus });
};
