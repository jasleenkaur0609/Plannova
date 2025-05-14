import { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionModel from './TransactionModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import JSZip from 'jszip';

const TransactionList = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ page: 1, type: '', status: '', search: '', from: '', to: '' });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('table');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/admin/transactions`, { params: filters });
      setTransactions(res.data.transactions);
      setTotalPages(Math.ceil(res.data.total / 10));
      setError('');
    } catch (err) {
      console.error('Fetch Error:', err.message);
      setError('Server Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handlePageChange = (dir) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + dir, totalPages)),
    }));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['#', 'Date', 'Event', 'User', 'Type', 'Amount', 'Method', 'Status']],
      body: transactions.map((t, i) => [
        (filters.page - 1) * 10 + i + 1,
        new Date(t.createdAt).toLocaleString(),
        t.eventName || '—',
        t.userName,
        t.type,
        `₹${t.amount}`,
        t.method,
        t.status,
      ]),
    });
    doc.save('transactions.pdf');
  };

  const exportCSV = () => {
    const csv = Papa.unparse(
      transactions.map((t) => ({
        date: new Date(t.createdAt).toLocaleString(),
        event: t.eventName,
        user: t.userName,
        type: t.type,
        amount: t.amount,
        method: t.method,
        status: t.status,
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'transactions.csv');
  };

  const downloadAllReceipts = async () => {
    const zip = new JSZip();
    for (const txn of transactions) {
      const receipt = `Receipt for ${txn.userName}\nEvent: ${txn.eventName}\nAmount: ₹${txn.amount}\nStatus: ${txn.status}`;
      zip.file(`${txn._id}.txt`, receipt);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'receipts.zip');
  };

  const downloadReceiptPDF = (txn) => {
    const doc = new jsPDF();
    doc.setFontSize(26);
    doc.setTextColor('#4A5759');
    doc.setFont('helvetica', 'bold');
    doc.text('Plannova', 14, 20);

    doc.setFontSize(16);
    doc.setTextColor('#EDAFB8');
    doc.setFont('helvetica', 'normal');
    doc.text('Transaction Receipt', 14, 30);

    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text(`Transaction ID: ${txn._id}`, 14, 45);
    doc.text(`Date: ${new Date(txn.createdAt).toLocaleString()}`, 14, 52);

    autoTable(doc, {
      startY: 65,
      theme: 'grid',
      headStyles: {
        fillColor: '#EDAFB8',
        textColor: '#4A5759',
        fontSize: 12,
      },
      bodyStyles: {
        textColor: '#4A5759',
        fontSize: 11,
      },
      head: [['Field', 'Details']],
      body: [
        ['User Name', txn.userName || '—'],
        ['Event Name', txn.eventName || '—'],
        ['Type', txn.type || '—'],
        ['Method', txn.method || '—'],
        ['Amount Paid', `₹${txn.amount}`],
        ['Status', txn.status || '—'],
      ],
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor('#888888');
    doc.text('Thank you for using Plannova! For support, contact support@plannova.com', 14, pageHeight - 10);

    doc.save(`${txn._id}_receipt.pdf`);
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleDateFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7E1D7] text-[#4A5759] px-6 py-6 w-full overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by user or event"
          value={filters.search}
          onChange={handleSearch}
          className="border p-2 rounded"
        />
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <input type="date" onChange={(e) => handleDateFilter('from', e.target.value)} />
        <input type="date" onChange={(e) => handleDateFilter('to', e.target.value)} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={exportPDF} className="bg-[#B0C4B1] px-4 py-2 rounded text-white">Export PDF</button>
        <button onClick={exportCSV} className="bg-[#B0C4B1] px-4 py-2 rounded text-white">Export CSV</button>
        <button onClick={downloadAllReceipts} className="bg-[#B0C4B1] px-4 py-2 rounded text-white">Download Receipts</button>
        <button onClick={() => setView(view === 'table' ? 'grid' : 'table')} className="bg-[#DEDBD2] px-4 py-2 rounded">
          Toggle View
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          {view === 'table' ? (
            <div className="overflow-auto">
              <table className="w-full table-auto border-collapse bg-white rounded shadow-md">
                <thead className="bg-[#EDAFB8] text-white">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Event</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Method</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, i) => (
                    <tr
                      key={txn._id}
                      className="hover:bg-[#F7E1D7]/50 cursor-pointer"
                      onClick={() => setSelectedTransaction(txn)}
                    >
                      <td className="p-2 text-center">{(filters.page - 1) * 10 + i + 1}</td>
                      <td className="p-2">{new Date(txn.createdAt).toLocaleString()}</td>
                      <td className="p-2">{txn.eventName || '—'}</td>
                      <td className="p-2">{txn.userName}</td>
                      <td className="p-2">{txn.type}</td>
                      <td className="p-2">₹{txn.amount}</td>
                      <td className="p-2">{txn.method}</td>
                      <td className={`p-2 ${txn.status === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                        {txn.status}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadReceiptPDF(txn);
                          }}
                          className="text-sm text-[#4A5759] underline"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow-md">
              {transactions.map((txn) => (
                <div
                  key={txn._id}
                  onClick={() => setSelectedTransaction(txn)}
                  className="p-4 border hover:bg-[#F7E1D7]/40 transition cursor-pointer rounded"
                >
                  <h3 className="font-bold">{txn.eventName}</h3>
                  <p>Amount: ₹{txn.amount}</p>
                  <p>Status: <span className={txn.status === 'success' ? 'text-green-600' : 'text-red-500'}>{txn.status}</span></p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={filters.page === 1}
              className={`px-4 py-2 rounded ${filters.page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#B0C4B1] text-white'}`}
            >
              Previous
            </button>
            <span className="self-center">Page {filters.page} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(1)}
              disabled={filters.page === totalPages}
              className={`px-4 py-2 rounded ${filters.page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#B0C4B1] text-white'}`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Transaction Modal */}
      {selectedTransaction && (
        <TransactionModel
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionList;
