import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const downloadReceiptPDF = (txn) => {
  const doc = new jsPDF();

  // === Header Branding ===
  doc.setFontSize(26);
  doc.setTextColor('#4A5759'); // Brand Dark
  doc.setFont('helvetica', 'bold');
  doc.text('Plannova', 14, 20);

  // === Subheader Title ===
  doc.setFontSize(16);
  doc.setTextColor('#EDAFB8'); // Brand Pink
  doc.setFont('helvetica', 'normal');
  doc.text('Transaction Receipt', 14, 30);

  // === Metadata ===
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text(`Transaction ID: ${txn._id}`, 14, 45);
  doc.text(`Date: ${new Date(txn.createdAt).toLocaleString()}`, 14, 52);

  // === Transaction Details Table ===
  autoTable(doc, {
    startY: 65,
    theme: 'grid',
    headStyles: {
      fillColor: '#EDAFB8',     // Light pink header
      textColor: '#4A5759',     // Brand dark
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
      ['Initiated By', txn.initiatedBy || '—'],
    ],
  });

  // === Footer ===
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor('#888888');
  doc.text('Thank you for using Plannova! For support, contact support@plannova.com', 14, pageHeight - 10);

  // === Save PDF ===
  doc.save(`${txn._id}_receipt.pdf`);
};
