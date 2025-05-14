// TransactionModal.jsx
import React from 'react';

const TransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#4A5759]">Transaction Details</h2>
        <div className="text-[#4A5759] space-y-2">
          <p><strong>Event:</strong> {transaction.eventName || '—'}</p>
          <p><strong>User:</strong> {transaction.userName}</p>
          <p><strong>Type:</strong> {transaction.type}</p>
          <p><strong>Amount:</strong> ₹{transaction.amount}</p>
          <p><strong>Status:</strong>{' '}
            <span className={transaction.status === 'success' ? 'text-green-600' : 'text-red-500'}>
              {transaction.status}
            </span>
          </p>
          <p><strong>Method:</strong> {transaction.method}</p>
          <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
          <p><strong>ID:</strong> {transaction._id}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
