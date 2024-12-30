// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import {
  adminListUsers,
  adminGetUserDetail,
  adminUpdateTxStatus
} from '../services/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await adminListUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('[AdminPanel] fetchUsers:', error);
    }
  };

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    setLoadingUser(true);
    setUserDetail(null);
    try {
      const { data } = await adminGetUserDetail(userId);
      setUserDetail(data);
    } catch (error) {
      console.error('[AdminPanel] handleUserClick:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleUpdateStatus = async (txId, newStatus) => {
    try {
      await adminUpdateTxStatus(txId, newStatus);
      alert(`Status changed to ${newStatus}`);
      // refrescar userDetail
      if (selectedUser) {
        const { data } = await adminGetUserDetail(selectedUser);
        setUserDetail(data);
      }
    } catch (error) {
      console.error('[AdminPanel] handleUpdateStatus:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* Col 1: lista usuarios */}
        <div className="bg-gray-800 p-3 rounded col-span-1">
          <h2 className="font-semibold mb-2">Users</h2>
          <div className="space-y-2">
            {users.map(u => (
              <div
                key={u._id}
                className={`bg-gray-700 p-2 rounded cursor-pointer ${
                  selectedUser === u._id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleUserClick(u._id)}
              >
                <p className="text-sm font-semibold">
                  SeedHash: {u.seedHash.slice(0, 6)}...
                </p>
                <p className="text-xs text-gray-400">
                  Cryptos: {u.cryptos.length} | Cards: {u.virtualCards.length}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2-3: Detalle del usuario */}
        <div className="col-span-2">
          {!selectedUser && (
            <p className="text-gray-300">Select a user to see details</p>
          )}
          {loadingUser && (
            <p className="text-gray-300">Loading user data...</p>
          )}
          {userDetail && !loadingUser && (
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="font-semibold mb-2">
                User: {userDetail.user.seedHash}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Created: {new Date(userDetail.user.createdAt).toLocaleString()}
              </p>

              {/* Cryptos */}
              <h3 className="font-bold text-sm mb-1">Cryptos:</h3>
              <ul className="mb-3 text-xs">
                {userDetail.user.cryptos.map((c, i) => (
                  <li key={i}>{c.symbol}: {c.amount}</li>
                ))}
              </ul>

              {/* Cards */}
              <h3 className="font-bold text-sm mb-1">Virtual Cards:</h3>
              <ul className="mb-3 text-xs">
                {userDetail.user.virtualCards.map((card, i) => (
                  <li key={i}>
                    {card.brand} - {card.cardNumber} (exp: {card.expiry})
                  </li>
                ))}
              </ul>

              {/* Transactions */}
              <h3 className="font-bold text-sm mb-1">Transactions:</h3>
              <div className="space-y-2">
                {userDetail.transactions.map(tx => (
                  <div
                    key={tx._id}
                    className="bg-gray-700 p-2 rounded flex justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {tx.type.toUpperCase()} - {tx.symbol}
                      </p>
                      <p className="text-xs text-gray-400">
                        {tx.amount} {tx.symbol}
                        <br/>
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={
                          tx.status === 'pending'
                            ? 'text-yellow-300'
                            : tx.status === 'completed'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        {tx.status.toUpperCase()}
                      </p>
                      {tx.status === 'pending' && (
                        <div className="mt-2 flex gap-1">
                          <button
                            onClick={() => handleUpdateStatus(tx._id, 'completed')}
                            className="bg-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-500"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(tx._id, 'failed')}
                            className="bg-red-600 px-2 py-1 rounded text-xs hover:bg-red-500"
                          >
                            Fail
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
